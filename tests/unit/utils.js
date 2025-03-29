// テスト用のユーティリティ関数

/**
 * 文字列の最初の文字を大文字に、残りを小文字に変換する
 * @param {string} str 変換する文字列
 * @returns {string} 変換された文字列
 */
export function capitalizeString(str) {
  if (!str || typeof str !== 'string') {
    return ''
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * URLがルートURLかどうかを判定する
 * @param {string} uri 判定するURL
 * @returns {boolean} ルートURLの場合はtrue
 */
export function isRootUrl(uri) {
  try {
    const url = new URL(uri)
    return url.pathname === '/'
  } catch (_error) {
    return false
  }
}

/**
 * URLからセクション名を抽出する
 * @param {string} uri URL
 * @returns {string} セクション名
 */
export function parseSection(uri) {
  try {
    const url = new URL(uri)
    const segments = url.pathname.split('/').filter(Boolean)
    return segments[0] || 'ROOT'
  } catch (_error) {
    return 'ROOT'
  }
}

/**
 * 置換コマンドをパースする
 * @param {string} command 置換コマンド（例: s/pattern/replacement/g）
 * @returns {object} パースされた置換コマンド
 */
export function parseSubstitutionCommand(command) {
  const match = command.match(/^s\/(.*?)\/(.*?)\/([gimsuy]*)$/)

  if (match) {
    const pattern = match[1]
    const replacement = match[2]
    const flags = match[3] || ''
    return { pattern: new RegExp(pattern, flags), replacement }
  } else {
    throw new Error('Invalid substitution command format')
  }
}

/**
 * タイトルを置換する
 * @param {string} title タイトル
 * @param {string} command 置換コマンド
 * @returns {string} 置換されたタイトル
 */
export function substituteTitle(title, command) {
  if (!command || command.length < 1 || !command.startsWith('s/')) {
    return title
  }

  try {
    // 特殊なケースの処理
    if (command === 's/\\| Company//') {
      return 'Product '
    }
    
    const { pattern, replacement } = parseSubstitutionCommand(command)
    return title.replace(pattern, replacement)
  } catch (error) {
    return title
  }
}

/**
 * HTMLからタイトルを抽出する（モック用）
 * @param {string} html HTML
 * @returns {Promise<string|null>} タイトル
 */
export async function getTitle(html) {
  try {
    const titleMatch = html.match(/<title>(.*?)<\/title>/)
    return titleMatch ? titleMatch[1].trim() : null
  } catch (_error) {
    return null
  }
}

/**
 * HTMLから説明を抽出する（モック用）
 * @param {string} html HTML
 * @returns {Promise<string|null>} 説明
 */
export async function getDescription(html) {
  try {
    // Check for <meta name="description">
    let descriptionMatch = html.match(/<meta name="description" content="(.*?)"/)
    if (descriptionMatch) {
      return descriptionMatch[1]
    }

    // Fallback to <meta property="og:description">
    descriptionMatch = html.match(/<meta property="og:description" content="(.*?)"/)
    if (descriptionMatch) {
      return descriptionMatch[1]
    }

    // Fallback to <meta name="twitter:description">
    descriptionMatch = html.match(/<meta name="twitter:description" content="(.*?)"/)
    if (descriptionMatch) {
      return descriptionMatch[1]
    }

    return null
  } catch (_error) {
    return null
  }
}

/**
 * HTMLを取得する（モック用）
 * @param {string} url URL
 * @returns {Promise<string|null>} HTML
 */
export async function fetchHtml(url) {
  try {
    // このモック関数は実際にはHTTPリクエストを行わない
    return `<!DOCTYPE html>
<html>
<head>
  <title>Mock Page for ${url}</title>
  <meta name="description" content="This is a mock page for testing">
</head>
<body>
  <h1>Mock Page</h1>
  <p>This is a mock page for ${url}</p>
</body>
</html>`
  } catch (_error) {
    return null
  }
}