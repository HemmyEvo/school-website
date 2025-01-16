import { NextConfig } from 'next';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
 
    images: {
        remotePatterns: [
            {
                hostname: "unique-raven-73.convex.cloud",
            },
        ],
    },
};

export default nextConfig;
