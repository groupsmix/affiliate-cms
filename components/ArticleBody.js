import styles from './ArticleBody.module.css';

/**
 * Renders article body content as HTML.
 * Supports paragraphs, headings, lists, and links.
 * Returns null if body is empty or missing.
 *
 * @param {{ body: string | null }} props
 */
export default function ArticleBody({ body }) {
  if (!body) return null;

  return (
    <div
      className={styles.body}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
