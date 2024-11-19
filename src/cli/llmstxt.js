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
  .argument('[url]', 'sitemap url', 'https://dotenvx.com/sitemap.xml')
  .option('-ep, --exclude-path <excludePath...>', 'path(s) to exclude from generation (default: none)')
  .option('-ip, --include-path <includePath...>', 'path(s) to include from generation (default: all)')
  .action(genAction)

program.parse()
