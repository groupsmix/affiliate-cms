/**
 * Compute the average product rating from the nested
 * content_products join returned by Supabase.
 *
 * Shape: content_products: Array<{ products: { rating: number | null } | null }>
 */
export function averageRating(
  contentProducts?: Array<{ products: { rating: number | null } | null }> | null,
): number | null {
  if (!contentProducts || contentProducts.length === 0) return null;

  const ratings: number[] = [];
  for (const cp of contentProducts) {
    if (cp.products && typeof cp.products.rating === 'number') {
      ratings.push(cp.products.rating);
    }
  }

  if (ratings.length === 0) return null;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}
