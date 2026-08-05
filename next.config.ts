import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle so the Docker image can ship just the
  // traced dependencies instead of the whole node_modules tree. See Dockerfile.
  output: "standalone",
  experimental: {
    useTypeScriptCli: true,
  },
};

export default nextConfig;
