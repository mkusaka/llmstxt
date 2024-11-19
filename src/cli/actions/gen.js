const Sitemapper = require('sitemapper')
const { request } = require('undici')
const Turndown = require('turndown')
const tds = new Turndown()

const sitemap = new Sitemapper()

async function fetchHtml(url) {
  try {
    const { body } = await request(url)
    const rawHtml = await body.text()
    return rawHtml
  } catch (error) {
    console.error(`Error fetching HTML for ${url}:`, error.message)
    return null
  }
}

async function gen (url) {
  try {
    const sites = await sitemap.fetch(url)
    console.log(`Found ${sites.sites.length} URLs in the sitemap.`)

    for (const site of sites.sites) {
      console.log(`Fetching raw HTML for: ${site}`)

      const rawHtml = await fetchHtml(site)
      if (rawHtml) {
        const md = tds.turndown(rawHtml)
        if (md) {
          console.log(md)
        }
      }
    }
  } catch (error) {
    console.error(`Error processing sitemap:`, error.message)
  }
}

module.exports = gen
