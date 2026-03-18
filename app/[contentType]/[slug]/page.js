import { notFound } from 'next/navigation';
import { getContentBySlug, getProductsByContentId } from '../../../lib/queries.js';

const VALID_CONTENT_TYPES = new Set([
  'best',
  'review',
  'comparison',
  'problem',
  'alternative',
]);

/**
 * Generate page metadata from content fields.
 */
export async function generateMetadata({ params }) {
  const { contentType, slug } = await params;

  if (!VALID_CONTENT_TYPES.has(contentType)) {
    return {};
  }

  const content = await getContentBySlug(slug, contentType);

  if (!content) {
    return {};
  }

  return {
    title: content.meta_title ?? content.title,
    description: content.meta_description ?? content.excerpt ?? '',
  };
}

/**
 * Dynamic content page — fetches content + linked products by slug and content type.
 */
export default async function ContentPage({ params }) {
  const { contentType, slug } = await params;

  if (!VALID_CONTENT_TYPES.has(contentType)) {
    notFound();
  }

  const content = await getContentBySlug(slug, contentType);

  if (!content) {
    notFound();
  }

  const products = await getProductsByContentId(content.id);

  return (
    <pre>{JSON.stringify({ content, products }, null, 2)}</pre>
  );
}
