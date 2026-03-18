/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // The existing src/ code has .js extensions in imports (ESM style)
    // Next.js handles this fine but we skip strict checks for CLI files
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
