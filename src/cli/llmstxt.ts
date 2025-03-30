#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../lib/helpers/packageJson';
import genAction from './actions/gen';
import fullAction from './actions/full';

const program = new Command();

// cli
program
  .name('llmstxt')
  .description(packageJson.description)
  .version(packageJson.version);

// llmstxt gen
program.command('gen')
  .description('generate llms.txt')
  .argument('[url]', 'sitemap url', 'https://vercel.com/sitemap.xml')
  .option('-ep, --exclude-path <excludePath...>', 'path(s) to exclude from generation (default: none)')
  .option('-ip, --include-path <includePath...>', 'path(s) to include from generation (default: all)')
  .option('-rt, --replace-title <replaceTitle...>', 'replace string(s) from title (default: none)')
  .option('-t, --title <title>', 'set title (default: root page title)')
  .option('-d, --description <description>', 'set description (default: root page description)')
  .action(genAction);

// llmstxt full
program.command('full')
  .description('generate llms-full.txt with complete page content')
  .argument('[url]', 'sitemap url', 'https://vercel.com/sitemap.xml')
  .option('-ep, --exclude-path <excludePath...>', 'path(s) to exclude from generation (default: none)')
  .option('-ip, --include-path <includePath...>', 'path(s) to include from generation (default: all)')
  .option('-rt, --replace-title <replaceTitle...>', 'replace string(s) from title (default: none)')
  .option('-t, --title <title>', 'set title (default: root page title)')
  .option('-d, --description <description>', 'set description (default: root page description)')
  .action(fullAction);

program.parse();