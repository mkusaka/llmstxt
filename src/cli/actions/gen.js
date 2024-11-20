const { URL } = require('url')
const cheerio = require('cheerio')
const picomatch = require('picomatch')
const { request } = require('undici')
const Sitemapper = require('sitemapper')
const sitemap = new Sitemapper()

async function fetchHtml (url) {
  try {
    const { body } = await request(url)
    const rawHtml = await body.text()
    return rawHtml
  } catch (_error) {
    return null
  }
}

async function getTitle (html) {
  try {
    const $ = cheerio.load(html)
    return $('head > title').text().trim()
  } catch (_error) {
    return null
  }
}

async function getDescription (html) {
  try {
    const $ = cheerio.load(html)

    // Check for <meta name="description">
    let description = $('head > meta[name="description"]').attr('content')

    // Fallback to <meta property="og:description">
    if (!description) {
      description = $('head > meta[property="og:description"]').attr('content')
    }

    // Fallback to <meta name="twitter:description">
    if (!description) {
      description = $('head > meta[name="twitter:description"]').attr('content')
    }

    return description
  } catch (_error) {
    return null
  }
}

function parseSubstitutionCommand (command) {
  const match = command.match(/^s\/(.*?)\/(.*?)\/([gimsuy]*)$/) // Capture optional flags

  if (match) {
    const pattern = match[1] // The pattern to search for
    const replacement = match[2] // The replacement string
    const flags = match[3] || '' // Extract flags (e.g., 'g', 'i')
    return { pattern: new RegExp(pattern, flags), replacement }
  } else {
    throw new Error('Invalid substitution command format')
  }
}

function parseSection(uri) {
  try {
    const url = new URL(uri)
    const segments = url.pathname.split('/').filter(Boolean)
    return segments[0] || 'ROOT'
  } catch (_error) {
    return 'ROOT'
  }
}

function substituteTitle (title, command) {
  if (!command || command.length < 1 || !command.startsWith('s/')) {
    return title
  }

  const { pattern, replacement } = parseSubstitutionCommand(command)

  return title.replace(pattern, replacement)
}

function isRootUrl (uri) {
  try {
    const url = new URL(uri)
    return url.pathname === '/'
  } catch (_error) {
    return false
  }
}

function capitalizeString(str) {
  if (!str || typeof str !== 'string') {
    return ''
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

async function gen (sitemapUrl) {
  const options = this.opts()

  // include/exclude logic
  const excludePaths = options.excludePath || []
  const includePaths = options.includePath || []
  const isExcluded = picomatch(excludePaths)
  const isIncluded = picomatch(includePaths, { ignore: excludePaths })

  // replaceTitle logic
  const replaceTitle = options.replaceTitle || []

  const sections = {}

  try {
    const sites = await sitemap.fetch(sitemapUrl)

    for (const url of sites.sites) {
      // path excluded - don't process it
      if (isExcluded(url)) {
        continue
      }

      // path effectively excluded (by not being in the list of includes) - don't process it
      if (includePaths.length > 0 && !isIncluded(url)) {
        continue
      }

      // html
      const html = await fetchHtml(url)
      if (!html) {
        continue
      }

      // title
      let title = await getTitle(html)
      if (!title) {
        continue
      }
      for (command of replaceTitle) {
        title = substituteTitle(title, command)
      }
      title = title.trim()

      // description
      const description = await getDescription(html)

      const line = {
        title,
        url,
        description
      }

      // set up section
      const section = parseSection(url)
      sections[section] ||= []

      // add line
      sections[section].push(line)

    }
  } catch (error) {
    console.error('Error processing sitemap:', error.message)
  }

  let output = ''

  // handle root
  const root = sections.ROOT
  delete sections.ROOT

  output += `# ${options.title || root[0].title}`
  output += '\n'
  output += '\n'
  output += `> ${options.description || root[0].description}`
  output += '\n'
  output += '\n'

  // handle sections
  for (const section in sections) {
    output += `## ${capitalizeString(section)}`
    output += '\n'
    for (const line of sections[section]) {
      const { title, url, description } = line
      output += '\n'
      output += `- [${title}](${url}): ${description}`
    }
    output += '\n'
    output += '\n'
  }

  console.log(output)
}

module.exports = gen
