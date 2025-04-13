const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuração para resolver os caminhos
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, './client/src'),
        '@shared': path.resolve(__dirname, './shared'),
      }
      return config
    },
  }
  
  module.exports = nextConfig