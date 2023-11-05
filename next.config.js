/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "utfs.io"
        ]
    },
    env: {
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    },
}

module.exports = nextConfig
