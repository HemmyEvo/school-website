import { NextConfig } from 'next';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
 
    images: {
        remotePatterns: [
            {
                hostname: "exciting-marlin-134.convex.cloud",
            },
        ],
    },
};

export default nextConfig;
