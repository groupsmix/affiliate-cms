import styles from './BestTemplate.module.css';
import ArticleHeader from '../ArticleHeader.js';
import ProductCard from '../ProductCard.js';
import ArticleBody from '../ArticleBody.js';
import ComparisonTable from '../ComparisonTable.js';
import FAQBlock from '../FAQBlock.js';
import RelatedContent from '../RelatedContent.js';

/**
 * "Best of" list page template.
 * Orchestrates all blocks for a best-products roundup page.
 *
 * @param {{
 *   content: object,
 *   products: object[],
 *   relatedContent?: object[],
 *   faqItems?: Array<{ question: string, answer: string }>
 * }} props
 */
export default function BestTemplate({
  content,
  products,
  relatedContent = [],
  faqItems = [],
}) {
  const quickPicks = products.slice(0, 3);

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

      {quickPicks.length > 0 && (
        <section className={styles.picks}>
          {quickPicks.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
              href={product.custom_affiliate_url || product.affiliate_url || '#'}
            />
          ))}
        </section>
      )}

      <ArticleBody body={content.body} />

      <ComparisonTable products={products} />

      <FAQBlock items={faqItems} />

      <RelatedContent items={relatedContent} />
    </article>
  );
}
