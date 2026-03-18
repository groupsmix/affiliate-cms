import styles from './TableOfContents.module.css';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(html: string): TocItem[] {
  const regex = /<h([23])([^>]*)>(.*?)<\/h[23]>/gi;
  const items: TocItem[] = [];
  let match;
  let idx = 0;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    if (!text) continue;

    const existingId = match[2].match(/id=["']([^"']+)["']/);
    const id = existingId ? existingId[1] : `section-${idx}`;
    items.push({ id, text, level });
    idx++;
  }

  return items;
}

export function injectHeadingIds(html: string): string {
  let idx = 0;
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (fullMatch, level, attrs, content) => {
    const hasId = /id=["']/.test(attrs);
    if (hasId) {
      idx++;
      return fullMatch;
    }
    const id = `section-${idx}`;
    idx++;
    return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
  });
}

export default function TableOfContents({ headings }: { headings: TocItem[] }) {
  if (headings.length < 3) return null;

  return (
    <nav className={styles.toc}>
      <h2 className={styles.tocTitle}>محتويات المقال</h2>
      <ol className={styles.tocList}>
        {headings.map((h) => (
          <li
            key={h.id}
            className={h.level === 3 ? styles.tocItemNested : styles.tocItem}
          >
            <a href={`#${h.id}`} className={styles.tocLink}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
