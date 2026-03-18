const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'img', 'hr', 'div', 'span', 'sup', 'sub',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan']),
};

const ATTR_RE = /\s+([a-z][a-z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/gi;
const TAG_RE = /<\/?([a-z][a-z0-9]*)\b([^>]*)?\s*\/?>/gi;
const DANGEROUS_RE = /<script[\s>]|<\/script>|javascript:|on[a-z]+\s*=/gi;

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  let cleaned = html.replace(DANGEROUS_RE, '');

  cleaned = cleaned.replace(TAG_RE, (match, tagName: string, attrsStr: string) => {
    const tag = tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    const isClosing = match.startsWith('</');
    if (isClosing) {
      return `</${tag}>`;
    }

    const isSelfClosing = match.endsWith('/>') || tag === 'br' || tag === 'hr' || tag === 'img';
    const allowedAttrsForTag = ALLOWED_ATTRS[tag];
    let safeAttrs = '';

    if (attrsStr && allowedAttrsForTag) {
      let attrMatch;
      ATTR_RE.lastIndex = 0;
      while ((attrMatch = ATTR_RE.exec(attrsStr)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

        if (!allowedAttrsForTag.has(attrName)) continue;

        if (attrName === 'href' || attrName === 'src') {
          if (/^javascript:/i.test(attrValue.trim())) continue;
          if (/^data:/i.test(attrValue.trim()) && attrName === 'href') continue;
        }

        safeAttrs += ` ${attrName}="${escapeAttr(attrValue)}"`;
      }
    }

    if (tag === 'a' && !safeAttrs.includes('rel=')) {
      safeAttrs += ' rel="noopener noreferrer"';
    }

    return isSelfClosing ? `<${tag}${safeAttrs} />` : `<${tag}${safeAttrs}>`;
  });

  return cleaned;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
