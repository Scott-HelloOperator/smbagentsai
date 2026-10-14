/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // OG image routes read brand fonts from disk at runtime.
  experimental: { outputFileTracingIncludes: { "/**": ["./assets/fonts/**"] } },
};
