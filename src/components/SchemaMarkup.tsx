interface ReviewSchemaProps {
  type: 'review';
  title: string;
  excerpt: string | null;
  author: string | null;
  publishedAt: string | null;
  slug: string;
  rating: number | null;
  productName: string | null;
}

interface ArticleSchemaProps {
  type: 'article';
  title: string;
  excerpt: string | null;
  author: string | null;
  publishedAt: string | null;
  slug: string;
  contentType: string;
}

interface ProductSchemaProps {
  type: 'product';
  name: string;
  description: string | null;
  rating: number | null;
  url: string;
}

interface FAQSchemaProps {
  type: 'faq';
  questions: { question: string; answer: string }[];
}

type SchemaProps = ReviewSchemaProps | ArticleSchemaProps | ProductSchemaProps | FAQSchemaProps;

function buildReviewSchema(props: ReviewSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: props.title,
    description: props.excerpt || undefined,
    author: {
      '@type': 'Person',
      name: props.author || 'فريق أدوات البريد',
    },
    datePublished: props.publishedAt || undefined,
    url: `/${props.slug}`,
  };

  if (props.productName) {
    schema.itemReviewed = {
      '@type': 'SoftwareApplication',
      name: props.productName,
      applicationCategory: 'Email Marketing',
    };
  }

  if (props.rating !== null && props.rating !== undefined) {
    schema.reviewRating = {
      '@type': 'Rating',
      ratingValue: props.rating,
      bestRating: 10,
      worstRating: 1,
    };
  }

  return schema;
}

function buildArticleSchema(props: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.excerpt || undefined,
    author: {
      '@type': 'Person',
      name: props.author || 'فريق أدوات البريد',
    },
    datePublished: props.publishedAt || undefined,
    publisher: {
      '@type': 'Organization',
      name: 'أدوات البريد',
    },
  };
}

function buildProductSchema(props: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: props.name,
    description: props.description || undefined,
    applicationCategory: 'Email Marketing',
    url: props.url,
  };

  if (props.rating !== null && props.rating !== undefined) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: props.rating,
      bestRating: 10,
      worstRating: 1,
      ratingCount: 1,
    };
  }

  return schema;
}

function buildFAQSchema(props: FAQSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export default function SchemaMarkup(props: SchemaProps) {
  let schema: Record<string, unknown>;

  switch (props.type) {
    case 'review':
      schema = buildReviewSchema(props);
      break;
    case 'article':
      schema = buildArticleSchema(props);
      break;
    case 'product':
      schema = buildProductSchema(props);
      break;
    case 'faq':
      schema = buildFAQSchema(props);
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
