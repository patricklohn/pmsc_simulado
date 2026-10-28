import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Nomes legíveis das classes do styled-components no navegador
  compiler: { styledComponents: true },
  poweredByHeader: false,
};

export default nextConfig;
