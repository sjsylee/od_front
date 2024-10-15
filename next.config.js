/** @type {import('next').NextConfig} */

const CMS_URL = process.env.CMS_URL;

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/order_confirm/:trans_id/:m_prd_id",
        destination: `${CMS_URL}/order_confirm/:trans_id/:m_prd_id`,
      },
    ];
  },
};

module.exports = nextConfig;
