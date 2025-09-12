const MINIS_URLS = {
    MINIS_ARTICLES: 'MINIS_ARTICLES',
    MINIS_VIDEOS_URL: {
        VIDEO_LISTING: 'VIDEO_LISTING',
        VIDEO_PLAYER: 'VIDEO_PLAYER'
    },
    MINIS_SLIDES_URL: {
        SLIDES_LISTING: 'SLIDES_LISTING',
        SLIDES_PLAYER: 'SLIDES_PLAYER'
    },
    MINIS_ARTICLES_LANDING_URL: {
        ARTICLE_LISTING: 'ARTICLE_LISTING'
    }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            // API Proxy for unified feed endpoint
            {
                source: '/api/feed/:path*',
                destination: 'https://www.naukri.com/cloudgateway-mynaukri/naukri-content-management-services/v0/public/unified/feed/:path*'
            },
            // API Proxy for regular feed endpoint  
            {
                source: '/api/feed/:path*',
                destination: 'https://gateway.dev.infoedge.com:9090/cloudgateway-mynaukri/naukri-content-management-services/v0/public/feed/:path*'
            },
            // General API proxy for other naukri services
            {
                source: '/api/naukri/:path*',
                destination: 'https://gateway.dev.infoedge.com:9090/cloudgateway-mynaukri/:path*'
            },
            // Existing minis routes
            {
                source: '/minis',
                destination: `/minis?urlType=${MINIS_URLS.MINIS_ARTICLES}`
            },
            {
                source: '/minis/video-(.)*',
                destination: `/minis?urlType=${MINIS_URLS.MINIS_VIDEOS_URL.VIDEO_PLAYER}`
            },
            {
                source: '/minis/slide-(.)*',
                destination: `/minis?urlType=${MINIS_URLS.MINIS_SLIDES_URL.SLIDES_PLAYER}`
            },
            {
                source: '/minis/article-(.)*',
                destination: `/minis?urlType=${MINIS_URLS.MINIS_ARTICLES_LANDING_URL.ARTICLE_LISTING}`
            }
        ];
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.naukimg.com',
            },
            {
                protocol: 'https',
                hostname: 'static.naukimg.com',
            },
            {
                protocol: 'https',
                hostname: 'img.naukri.com',
            },
            {
                protocol: 'https',
                hostname: 'www.naukri.com',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
            }
        ]
    }
};

module.exports = nextConfig;
