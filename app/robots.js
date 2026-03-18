/**
 * Robots configuration.
 * Disallow affiliate redirect routes, allow everything else.
 */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/go/',
    },
  };
}
