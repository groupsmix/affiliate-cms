import styles from './ReviewTemplate.module.css';
import ArticleHeader from '../ArticleHeader.js';
import ProductCard from '../ProductCard.js';
import ArticleBody from '../ArticleBody.js';
import RatingBlock from '../RatingBlock.js';
import ProsConsBlock from '../ProsConsBlock.js';
import CTABlock from '../CTABlock.js';
import FAQBlock from '../FAQBlock.js';
import RelatedContent from '../RelatedContent.js';

/**
 * Review page template.
 * Orchestrates all blocks for a single-product review page.
 *
 * @param {{
 *   content: object,
 *   products: object[],
 *   relatedContent?: object[],
 *   faqItems?: Array<{ question: string, answer: string }>,
 *   pros?: string[],
 *   cons?: string[],
 *   subRatings?: Array<{ label: string, value: number }>
 * }} props
 */
export default function ReviewTemplate({
  content,
  products,
  relatedContent = [],
  faqItems = [],
  pros = [],
  cons = [],
  subRatings = [],
}) {
  const primaryProduct =
    products.find((p) => p.placement === 'primary') || products[0] || null;

  const affiliateHref = primaryProduct
    ? primaryProduct.custom_affiliate_url || primaryProduct.affiliate_url
    : null;

  return (
    <article className={styles.wrapper}>
      <ArticleHeader
        title={content.title}
        primaryKeyword={content.primary_keyword}
        author={content.author}
        publishedAt={content.published_at}
      />

      {primaryProduct && (
        <ProductCard product={primaryProduct} href={affiliateHref} />
      )}

      <ArticleBody body={content.body} />

      {primaryProduct && (
        <RatingBlock rating={primaryProduct.rating} subRatings={subRatings} />
      )}

      <ProsConsBlock pros={pros} cons={cons} />

      {primaryProduct && affiliateHref && (
        <CTABlock href={affiliateHref} label="جرّب الآن" />
      )}

      <FAQBlock items={faqItems} />

      <RelatedContent items={relatedContent} />
    </article>
  );
}
