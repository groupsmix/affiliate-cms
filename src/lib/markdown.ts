import { marked } from 'marked';

/**
 * Parse markdown string to HTML.
 * Uses `marked` with safe defaults.
 */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
