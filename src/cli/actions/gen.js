const cheerio = require('cheerio')
const picomatch = require('picomatch')
const { request } = require('undici')
const Sitemapper = require('sitemapper')
const Turndown = require('turndown')

const sitemap = new Sitemapper()
const turndown = new Turndown()

async function fetchHtml(url) {
  try {
    const { body } = await request(url)
    const rawHtml = await body.text()
    return rawHtml
  } catch (_error) {
    return null
  }
}

async function getTitle(html) {
  try {
    const $ = cheerio.load(html)
    return $('head > title').text().trim()
  } catch (_error) {
    return null
  }
}

async function getDescription(html) {
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

function parseSubstitutionCommand(command) {
  const match = command.match(/^s\/(.*?)\/(.*?)\/([gimsuy]*)$/) // Capture optional flags

  if (match) {
    const pattern = match[1] // The pattern to search for
    const replacement = match[2] // The replacement string
    const flags = match[3] || '' // Extract flags (e.g., 'g', 'i')
    return { pattern: new RegExp(pattern, flags), replacement }
  } else {
    throw new Error("Invalid substitution command format")
  }
}

function substituteTitle(title, command) {
  if (!command || command.length < 1 || !command.startsWith('s/')) {
    return title
  }

  const { pattern, replacement } = parseSubstitutionCommand(command)

  return title.replace(pattern, replacement)
}

async function gen (sitemapUrl) {
  const options = this.opts()

  // include/exclude logic
  const excludePaths = options.excludePath || []
  const includePaths = options.includePath || []
  const isExcluded = picomatch(excludePaths)
  const isIncluded = picomatch(includePaths, { ignore: excludePaths })

  // replaceTitle logic
  const replaceTitle = options.replaceTitle

  let lines = []

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

      lines.push(`- [${title}](${url}): ${description}`)
    }
  } catch (error) {
    console.error(`Error processing sitemap:`, error.message)
  }

  const md = lines.join('\n')

  console.log(md)
}

module.exports = gen
