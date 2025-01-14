/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['tesseract.js'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto']
  },
  webpack: (config) => {
    // Fix for `import type` issues
    config.module.rules.push({
      test: /\.(ts|js)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel']
          }
        }
      ],
      exclude: /node_modules/
    });

    return config;
  },
};

export default nextConfig;
