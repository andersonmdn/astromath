import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@astromath/shared"],
  output: "standalone",
};

export default nextConfig;
