import { useRouter } from 'next/router';

// Mock implementation of useRouteToUrlHook
const useRouteToUrlHook = () => {
    const router = useRouter();

    return (options) => {
        const { url, softLoad, preserveNavBarParam, preserveUtmParams, replace } = options || {};
        
        // Check if URL is absolute (starts with http:// or https://)
        const isAbsoluteUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
        
        if (isAbsoluteUrl) {
            // For absolute URLs, use window.location for navigation
            if (replace) {
                window.location.replace(url);
            } else {
                window.location.href = url;
            }
        } else {
            // For relative URLs, use Next.js router
            if (replace) {
                router.replace(url);
            } else {
                router.push(url);
            }
        }
    };
};

export default useRouteToUrlHook;


