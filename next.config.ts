import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow q=82 alongside the default 75. Bumping the package photos to 82 also
    // changes their optimizer URLs, busting any stale browser-cached versions.
    qualities: [75, 82],
  },
};

export default nextConfig;
