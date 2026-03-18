import styles from './ProblemTemplate.module.css';
import ArticleHeader from '../ArticleHeader.js';
import ArticleBody from '../ArticleBody.js';
import ProductCard from '../ProductCard.js';
import FAQBlock from '../FAQBlock.js';
import RelatedContent from '../RelatedContent.js';

/**
 * Problem/solution page template.
 * Orchestrates all blocks for a "how to solve X" page.
 *
 * @param {{
 *   content: object,
 *   products: object[],
 *   relatedContent?: object[],
 *   faqItems?: Array<{ question: string, answer: string }>
 * }} props
 */
export default function ProblemTemplate({
  content,
  products,
  relatedContent = [],
  faqItems = [],
}) {
  return (
    <article className={styles.wrapper}>
      <ArticleHeader
        title={content.title}
        primaryKeyword={content.primary_keyword}
        author={content.author}
        publishedAt={content.published_at}
      />

      {content.excerpt && (
        <p className={styles.intro}>{content.excerpt}</p>
      )}

      <ArticleBody body={content.body} />

      {products.length > 0 && (
        <section className={styles.solutions}>
          <h2 className={styles.solutionsHeading}>الحلول المقترحة</h2>
          {products.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
              href={product.custom_affiliate_url || product.affiliate_url || '#'}
            />
          ))}
        </section>
      )}

      <FAQBlock items={faqItems} />

      <RelatedContent items={relatedContent} />
    </article>
  );
}
