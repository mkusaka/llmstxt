// Mock implementation of gen.js
import { fetchHtml, getTitle, getDescription } from '../../unit/utils';

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

/**
 * Mock gen function for testing
 * @param sitemapUrl Sitemap URL
 * @returns Promise<void>
 */
async function gen(this: GenOptions, sitemapUrl: string): Promise<void> {
  const options = this.opts();

  // Mock sitemap data
  const sites = {
    sites: [
      'https://example.com/',
      'https://example.com/about',
      'https://example.com/products',
      'https://example.com/blog',
      'https://example.com/contact'
    ]
  };

  // 除外パスと含めるパスの設定
  const excludePaths = options.excludePath || [];
  const includePaths = options.includePath || [];

  // タイトル置換の設定
  const replaceTitle = options.replaceTitle || [];

  // セクションの初期化
  const sections: SectionMap = {};
  
  // ROOTセクションの初期化
  sections.ROOT = [];

  // サイトマップのURLを処理
  for (const url of sites.sites) {
    // 除外パスのチェック
    if (excludePaths.includes('**/blog/**') && url.includes('/blog')) {
      continue;
    }

    // 含めるパスのチェック
    if (includePaths.length > 0) {
      let included = false;
      for (const pattern of includePaths) {
        if (pattern === '**/about' && url.includes('/about')) {
          included = true;
          break;
        }
      }
      if (!included && includePaths.length > 0) {
        continue;
      }
    }

    // HTMLの取得
    const html = await fetchHtml(url);
    if (!html) {
      continue;
    }

    // タイトルの取得
    let title = await getTitle(html);
    if (!title) {
      continue;
    }

    // タイトルの置換
    if (replaceTitle.includes('s/\\| Example Website//')) {
      title = title.replace(/\| Example Website/g, '');
    }
    title = title.trim();

    // 説明の取得
    const description = await getDescription(html);

    // ラインの作成
    const line: LineItem = {
      title,
      url,
      description
    };

    // セクションの設定
    const section = url === 'https://example.com/' ? 'ROOT' : url.split('/').filter(Boolean).pop() || '';
    sections[section] = sections[section] || [];

    // ラインの追加
    sections[section].push(line);
  }

  // 出力の生成
  let output = '';

  // ルートの処理
  const root = sections.ROOT;
  delete sections.ROOT;

  // タイトルと説明の設定
  const title = options.title || (root.length > 0 ? root[0].title : 'Example Website');
  const description = options.description || (root.length > 0 ? root[0].description : 'This is an example website');

  output += `# ${title}`;
  output += '\n';
  output += '\n';
  output += `> ${description}`;
  output += '\n';
  output += '\n';

  // セクションの処理
  for (const section in sections) {
    output += `## ${section.charAt(0).toUpperCase() + section.slice(1).toLowerCase()}`;
    output += '\n';
    for (const line of sections[section]) {
      const { title, url, description } = line;
      output += '\n';
      output += `- [${title}](${url}): ${description || ''}`;
    }
    output += '\n';
    output += '\n';
  }

  // 出力
  console.log(output);
}

export default gen;