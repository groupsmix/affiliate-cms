import styles from './ComparisonTemplate.module.css';
import ArticleHeader from '../ArticleHeader.js';
import ComparisonTable from '../ComparisonTable.js';
import ProductCard from '../ProductCard.js';
import ArticleBody from '../ArticleBody.js';
import FAQBlock from '../FAQBlock.js';
import RelatedContent from '../RelatedContent.js';

/**
 * Comparison page template.
 * Orchestrates all blocks for a head-to-head product comparison page.
 *
 * @param {{
 *   content: object,
 *   products: object[],
 *   relatedContent?: object[],
 *   faqItems?: Array<{ question: string, answer: string }>
 * }} props
 */
export default function ComparisonTemplate({
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
        <p className={styles.verdict}>{content.excerpt}</p>
      )}

      <ComparisonTable products={products} />

      {products.length > 0 && (
        <section className={styles.products}>
          {products.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
              href={product.custom_affiliate_url || product.affiliate_url || '#'}
            />
          ))}
        </section>
      )}

      <ArticleBody body={content.body} />

      <FAQBlock items={faqItems} />

      <RelatedContent items={relatedContent} />
    </article>
  );
}
