/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/get_data_by_sku/:sku",
        destination: "http://127.0.0.1:8000/get_data_by_sku/:sku",
      },
    ];
  },
};

module.exports = nextConfig;
