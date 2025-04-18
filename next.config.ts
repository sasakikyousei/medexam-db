import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['medical-license-db.s3.ap-southeast-2.amazonaws.com'], // ← ここにS3のドメインを追加
  },
};

export default nextConfig;
