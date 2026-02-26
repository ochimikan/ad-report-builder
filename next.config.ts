import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // pptxgenjs references node:https etc. internally.
      // Strip the node: prefix so webpack resolves them as normal modules,
      // then provide false fallbacks to stub them out for the browser.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource: { request: string }) => {
            resource.request = resource.request.replace(/^node:/, '');
          },
        ),
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        https: false,
        http: false,
        url: false,
        zlib: false,
        stream: false,
      };
    }
    return config;
  },
};

export default nextConfig;
