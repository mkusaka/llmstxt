#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()

const packageJson = require('./../lib/helpers/packageJson')

// cli
program
  .name('llmstxt')
  .description(packageJson.description)
  .version(packageJson.version)

// llmstxt gen
const genAction = require('./actions/gen')
program.command('gen')
  .description('generate llms.txt')
  .argument('[url]', 'sitemap url', 'https://vercel.com/sitemap.xml')
  .option('-ep, --exclude-path <excludePath...>', 'path(s) to exclude from generation (default: none)')
  .option('-ip, --include-path <includePath...>', 'path(s) to include from generation (default: all)')
  .option('-rt, --replace-title <replaceTitle...>', 'replace string(s) from title (default: none)')
  .option('-t, --title <title>', 'set title (default: root page title)')
  .option('-d, --description <description>', 'set description (default: root page description)')
  .action(genAction)

// llmstxt full
const fullAction = require('./actions/full.cjs')
program.command('full')
  .description('generate llms-full.txt with complete page content')
  .argument('[url]', 'sitemap url', 'https://vercel.com/sitemap.xml')
  .option('-ep, --exclude-path <excludePath...>', 'path(s) to exclude from generation (default: none)')
  .option('-ip, --include-path <includePath...>', 'path(s) to include from generation (default: all)')
  .option('-rt, --replace-title <replaceTitle...>', 'replace string(s) from title (default: none)')
  .option('-t, --title <title>', 'set title (default: root page title)')
  .option('-d, --description <description>', 'set description (default: root page description)')
  .action(fullAction)

program.parse()
