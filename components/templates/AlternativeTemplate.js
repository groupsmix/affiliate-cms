import styles from './AlternativeTemplate.module.css';
import ArticleHeader from '../ArticleHeader.js';
import ProductCard from '../ProductCard.js';
import ComparisonTable from '../ComparisonTable.js';
import ArticleBody from '../ArticleBody.js';
import FAQBlock from '../FAQBlock.js';
import RelatedContent from '../RelatedContent.js';

/**
 * Alternative page template.
 * Orchestrates all blocks for an "alternatives to X" page.
 *
 * @param {{
 *   content: object,
 *   products: object[],
 *   relatedContent?: object[],
 *   faqItems?: Array<{ question: string, answer: string }>
 * }} props
 */
export default function AlternativeTemplate({
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

      <ComparisonTable products={products} />

      <ArticleBody body={content.body} />

      <FAQBlock items={faqItems} />

      <RelatedContent items={relatedContent} />
    </article>
  );
}
