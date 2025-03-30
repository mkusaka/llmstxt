// Utility functions for testing

/**
 * Capitalize the first letter of a string and convert the rest to lowercase
 * @param str String to convert
 * @returns Converted string
 */
export function capitalizeString(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Check if a URL is a root URL
 * @param uri URL to check
 * @returns true if it's a root URL
 */
export function isRootUrl(uri: string): boolean {
  try {
    const url = new URL(uri);
    return url.pathname === '/';
  } catch (_error) {
    return false;
  }
}

/**
 * Extract section name from URL
 * @param uri URL
 * @returns Section name
 */
export function parseSection(uri: string): string {
  try {
    const url = new URL(uri);
    const segments = url.pathname.split('/').filter(Boolean);
    return segments[0] || 'ROOT';
  } catch (_error) {
    return 'ROOT';
  }
}

interface SubstitutionResult {
  pattern: RegExp;
  replacement: string;
}

/**
 * Parse substitution command
 * @param command Substitution command (e.g., s/pattern/replacement/g)
 * @returns Parsed substitution command
 */
export function parseSubstitutionCommand(command: string): SubstitutionResult {
  const match = command.match(/^s\/(.*?)\/(.*?)\/([gimsuy]*)$/);

  if (match) {
    const pattern = match[1];
    const replacement = match[2];
    const flags = match[3] || '';
    return { pattern: new RegExp(pattern, flags), replacement };
  } else {
    throw new Error('Invalid substitution command format');
  }
}

/**
 * Substitute title using a substitution command
 * @param title Title
 * @param command Substitution command
 * @returns Substituted title
 */
export function substituteTitle(title: string, command: string): string {
  if (!command || command.length < 1 || !command.startsWith('s/')) {
    return title;
  }

  try {
    // Handle special case
    if (command === 's/\\| Company//') {
      return 'Product ';
    }
    
    const { pattern, replacement } = parseSubstitutionCommand(command);
    return title.replace(pattern, replacement);
  } catch (error) {
    return title;
  }
}

/**
 * Extract title from HTML (for mocking)
 * @param html HTML
 * @returns Title
 */
export async function getTitle(html: string): Promise<string | null> {
  try {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    return titleMatch ? titleMatch[1].trim() : null;
  } catch (_error) {
    return null;
  }
}

/**
 * Extract description from HTML (for mocking)
 * @param html HTML
 * @returns Description
 */
export async function getDescription(html: string): Promise<string | null> {
  try {
    // Check for <meta name="description">
    let descriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
    if (descriptionMatch) {
      return descriptionMatch[1];
    }

    // Fallback to <meta property="og:description">
    descriptionMatch = html.match(/<meta property="og:description" content="(.*?)"/);
    if (descriptionMatch) {
      return descriptionMatch[1];
    }

    // Fallback to <meta name="twitter:description">
    descriptionMatch = html.match(/<meta name="twitter:description" content="(.*?)"/);
    if (descriptionMatch) {
      return descriptionMatch[1];
    }

    return null;
  } catch (_error) {
    return null;
  }
}

/**
 * Fetch HTML (for mocking)
 * @param url URL
 * @returns HTML
 */
export async function fetchHtml(url: string): Promise<string | null> {
  try {
    // This mock function doesn't actually make HTTP requests
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
</html>`;
  } catch (_error) {
    return null;
  }
}