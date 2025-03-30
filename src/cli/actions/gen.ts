import { URL } from 'url';
import cheerio from 'cheerio';
import picomatch from 'picomatch';
import { request } from 'undici';
import Sitemapper from 'sitemapper';
import * as ora from 'ora';

const sitemap = new Sitemapper({ timeout: 15000 });

interface GenOptions {
  excludePath?: string[];
  includePath?: string[];
  replaceTitle?: string[];
  title?: string;
  description?: string;
  opts(): GenOptions;
}

interface LineItem {
  title: string;
  url: string;
  description: string | null;
}

interface SectionMap {
  [key: string]: LineItem[];
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

interface SubstitutionResult {
  pattern: RegExp;
  replacement: string;
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

function parseSection(uri: string): string {
  try {
    const url = new URL(uri);
    const segments = url.pathname.split('/').filter(Boolean);
    return segments[0] || 'ROOT';
  } catch (_error) {
    return 'ROOT';
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

function capitalizeString(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function gen(this: GenOptions, sitemapUrl: string): Promise<void> {
  const options = this.opts();

  // Create spinner
  const spinner = ora.default('generating').start();

  // include/exclude logic
  const excludePaths = options.excludePath || [];
  const includePaths = options.includePath || [];
  const isExcluded = picomatch(excludePaths);
  const isIncluded = picomatch(includePaths, { ignore: excludePaths });

  // replaceTitle logic
  const replaceTitle = options.replaceTitle || [];

  const sections: SectionMap = {};

  try {
    spinner.text = sitemapUrl;
    const sites = await sitemap.fetch(sitemapUrl);

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
      const description = await getDescription(html);

      const line: LineItem = {
        title,
        url,
        description
      };

      // set up section
      const section = parseSection(url);
      sections[section] = sections[section] || [];

      // add line
      sections[section].push(line);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error processing sitemap:', error.message);
    } else {
      console.error('Error processing sitemap:', error);
    }
  }

  let output = '';

  // handle root
  const root = sections.ROOT;
  delete sections.ROOT;

  if (root && root.length > 0) {
    output += `# ${options.title || root[0].title}`;
    output += '\n';
    output += '\n';
    output += `> ${options.description || root[0].description || ''}`;
    output += '\n';
    output += '\n';

    spinner.text = options.title || root[0].title;
  } else {
    output += `# ${options.title || 'Website'}`;
    output += '\n';
    output += '\n';
    output += `> ${options.description || 'No description available'}`;
    output += '\n';
    output += '\n';

    spinner.text = options.title || 'Website';
  }

  // handle sections
  for (const section in sections) {
    output += `## ${capitalizeString(section)}`;
    output += '\n';
    for (const line of sections[section]) {
      const { title, url, description } = line;
      output += '\n';
      output += `- [${title}](${url}): ${description || ''}`;

      spinner.text = title;
    }
    output += '\n';
    output += '\n';
  }
  spinner.succeed('generated');

  console.log(output);
}

export default gen;