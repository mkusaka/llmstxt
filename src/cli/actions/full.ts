import { URL } from 'url';
import cheerio from 'cheerio';
import picomatch from 'picomatch';
import { request } from 'undici';
import Sitemapper from 'sitemapper';
import * as ora from 'ora';
import TurndownService from 'turndown';

const sitemap = new Sitemapper({ timeout: 15000 });
const turndownService = new TurndownService();

interface FullOptions {
  excludePath?: string[];
  includePath?: string[];
  replaceTitle?: string[];
  title?: string;
  description?: string;
  opts(): FullOptions;
}

interface SubstitutionResult {
  pattern: RegExp;
  replacement: string;
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const { body } = await request(url);
    const rawHtml = await body.text();
    return rawHtml;
  } catch (_error) {
    return null;
  }
}

async function getTitle(html: string): Promise<string | null> {
  try {
    const $ = cheerio.load(html);
    return $('head > title').text().trim();
  } catch (_error) {
    return null;
  }
}

async function getDescription(html: string): Promise<string | null> {
  try {
    const $ = cheerio.load(html);

    // Check for <meta name="description">
    let description = $('head > meta[name="description"]').attr('content');

    // Fallback to <meta property="og:description">
    if (!description) {
      description = $('head > meta[property="og:description"]').attr('content');
    }

    // Fallback to <meta name="twitter:description">
    if (!description) {
      description = $('head > meta[name="twitter:description"]').attr('content');
    }

    return description || null;
  } catch (_error) {
    return null;
  }
}

async function getContent(html: string): Promise<string | null> {
  try {
    const $ = cheerio.load(html);
    
    // Try to find the main content area
    // Common selectors for main content
    const contentSelectors = [
      'main',
      'article',
      'div.content',
      'div.main-content',
      'div.post-content',
      'div.entry-content',
      'div.article-content',
      'div#content',
      'div#main-content'
    ];
    
    // Try each selector until we find content
    let contentHtml = '';
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        // Remove unwanted elements before extracting content
        element.find('nav, header, footer, aside, .sidebar, .ads, .comments, script, style').remove();
        contentHtml = element.html() || '';
        break;
      }
    }
    
    // If no specific content area found, use the body but try to clean it up
    if (!contentHtml) {
      const body = $('body');
      // Remove common non-content elements
      body.find('nav, header, footer, aside, .sidebar, .ads, .comments, script, style').remove();
      contentHtml = body.html() || '';
    }
    
    // Convert HTML to markdown
    if (contentHtml) {
      return turndownService.turndown(contentHtml);
    }
    
    return null;
  } catch (_error) {
    return null;
  }
}

function parseSubstitutionCommand(command: string): SubstitutionResult {
  const match = command.match(/^s\/(.*?)\/(.*?)\/([gimsuy]*)$/); // Capture optional flags

  if (match) {
    const pattern = match[1]; // The pattern to search for
    const replacement = match[2]; // The replacement string
    const flags = match[3] || ''; // Extract flags (e.g., 'g', 'i')
    return { pattern: new RegExp(pattern, flags), replacement };
  } else {
    throw new Error('Invalid substitution command format');
  }
}

function substituteTitle(title: string, command: string): string {
  if (!command || command.length < 1 || !command.startsWith('s/')) {
    return title;
  }

  const { pattern, replacement } = parseSubstitutionCommand(command);

  return title.replace(pattern, replacement);
}

function isRootUrl(uri: string): boolean {
  try {
    const url = new URL(uri);
    return url.pathname === '/';
  } catch (_error) {
    return false;
  }
}

async function full(this: FullOptions, sitemapUrl: string): Promise<void> {
  const options = this.opts();

  // Create spinner
  const spinner = ora.default('generating llms-full.txt').start();

  // include/exclude logic
  const excludePaths = options.excludePath || [];
  const includePaths = options.includePath || [];
  const isExcluded = picomatch(excludePaths);
  const isIncluded = picomatch(includePaths, { ignore: excludePaths });

  // replaceTitle logic
  const replaceTitle = options.replaceTitle || [];

  let output = '';
  let rootTitle = '';
  let rootDescription = '';

  try {
    spinner.text = sitemapUrl;
    const sites = await sitemap.fetch(sitemapUrl);

    // First, get the root page info
    for (const url of sites.sites) {
      if (isRootUrl(url)) {
        spinner.text = url;
        const html = await fetchHtml(url);
        if (html) {
          rootTitle = await getTitle(html) || 'Website';
          rootDescription = await getDescription(html) || 'No description available';
          break;
        }
      }
    }

    // Add website header
    output += `# ${options.title || rootTitle}`;
    output += '\n';
    output += '\n';
    output += `> ${options.description || rootDescription}`;
    output += '\n\n';

    // Process each page
    for (const url of sites.sites) {
      spinner.text = url;

      // path excluded - don't process it
      if (isExcluded(url)) {
        continue;
      }

      // path effectively excluded (by not being in the list of includes) - don't process it
      if (includePaths.length > 0 && !isIncluded(url)) {
        continue;
      }

      // html
      const html = await fetchHtml(url);
      if (!html) {
        continue;
      }

      // title
      let title = await getTitle(html);
      if (!title) {
        continue;
      }
      for (const command of replaceTitle) {
        title = substituteTitle(title, command);
      }
      title = title.trim();

      // description
      const description = await getDescription(html) || 'No description available';

      // content
      const content = await getContent(html) || 'No content available';

      // Add page separator
      output += '---\n';
      
      // Add page header
      output += `# ${title}\n`;
      output += `URL: ${url}\n`;
      output += `Description: ${description}\n\n`;
      
      // Add page content
      output += content;
      output += '\n\n';

      spinner.text = title;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error processing sitemap:', error.message);
    } else {
      console.error('Error processing sitemap:', error);
    }
  }

  spinner.succeed('generated llms-full.txt');

  console.log(output);
}

export default full;