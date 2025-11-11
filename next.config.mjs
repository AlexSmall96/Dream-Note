/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  reactStrictMode: true,
  typescript: {
    tsconfigPath: "./src/tsconfig.json",
  },
};

export default nextConfig;