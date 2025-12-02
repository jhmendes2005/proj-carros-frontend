import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/altimus2.arquivos.prod/**',
      },
      {
        protocol: 'https',
        hostname: 'bomjesusautomoveis.com',
        port: ''
      },
      // --- Adicionado suporte a HTTP para AutoCerto (Correção do Erro) ---
      {
        protocol: 'http',
        hostname: 'www.autocerto.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'www.autocerto.com',
        port: ''
      },
      {
        protocol: 'http',
        hostname: 'autocerto.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'autocerto.com',
        port: ''
      }
    ],
  },
};

export default nextConfig;