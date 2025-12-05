import React from 'react';
import Head from 'next/head';
import { SEO_DESCRIPTION, SEO_TITLE } from '../constants';

const SeoMetaTags = ({ 
    ogImg,
    ogTitle,
    ogDesc,
    url = '',
    noIndex = false
}) => {
    const appendFbDeepLinking = () => {
        const fbMetaLinks = [
            {
                property: 'al:android:package',
                content: 'naukriApp.appModules.login'
            },
            {
                property: 'al:android:app_name',
                content: 'Naukri'
            },
            {
                property: 'og:type',
                content: 'website'
            }
        ];

        return fbMetaLinks.map((item, key) => {
            return <meta key={key} property={item.property} content={item.content} />;
        });
    };

    const defaultOgImage = 'https://static.naukimg.com/s/0/0/i/collatedOffering/minisOGImg.png';

    return (
        <Head>
            <title>{ogTitle || SEO_TITLE}</title>
            <meta content={ogDesc || SEO_DESCRIPTION} name='description' />
            <meta content={ogTitle || SEO_TITLE} property='og:title' />
            <meta content={ogDesc || SEO_DESCRIPTION} property='og:description' />
            <meta content={ogImg || defaultOgImage} property='og:image' />
            
            {url && <meta content={url} property='og:url' />}
            <meta content='website' property='og:type' />
            <meta content='Naukri' property='og:site_name' />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle || SEO_TITLE} />
            <meta name="twitter:description" content={ogDesc || SEO_DESCRIPTION} />
            <meta name="twitter:image" content={ogImg || defaultOgImage} />
            
            {/* Viewport and mobile optimization */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#0f1116" />
            
            {/* Robots */}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            
            {/* Canonical URL */}
            {url && <link rel="canonical" href={url} />}
            
            {/* Facebook Deep Linking */}
            {appendFbDeepLinking()}
            
            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" />
            
            {/* Additional meta tags */}
            <meta name="application-name" content="Naukri Minis" />
            <meta name="apple-mobile-web-app-title" content="Naukri Minis" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </Head>
    );
};

export default SeoMetaTags;


