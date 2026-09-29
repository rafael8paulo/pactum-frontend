import type { NextConfig } from 'next';
import pkg from './package.json';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    // Usado como `buster` do cache persistido: novo deploy = cache antigo descartado.
    NEXT_PUBLIC_APP_VERSION: process.env.GITHUB_SHA ?? pkg.version,
  },
};

export default nextConfig;
