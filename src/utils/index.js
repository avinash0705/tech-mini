// Utility functions
export const isBrowser = () => typeof window !== 'undefined';

export const _get = (obj, path, defaultValue = null) => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result == null || typeof result !== 'object') {
            return defaultValue;
        }
        result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
};

export const getCurrentTimeStamp = () => {
    return new Date().getTime();
};



export const formatMinisRecords = (records, config, loginStatus) => {
    // Simple formatter for minis records
    return records.map(record => ({
        ...record,
        formatted: true,
        loginStatus
    }));
};

export const formatTimeStamp = (createdDate) => {
    if (!createdDate) return '';
    
    try {
        const createdDateTime = new Date(createdDate);
        if (Number.isNaN(createdDateTime.getTime())) {
            console.error('Invalid date provided to formatTimeStamp:', createdDate);
            return '';
        }

        const currentDateTime = new Date();
        const timeDiff = currentDateTime.getTime() - createdDateTime.getTime();

        if (timeDiff < 0) {
            console.warn('formatTimeStamp received a future date:', createdDate);
            return createdDateTime.toLocaleDateString();
        }

        const minutes = Math.floor(timeDiff / (1000 * 60));
        const roundedMinutes = Math.round(timeDiff / (1000 * 60));
        const roundedHours = Math.round(timeDiff / (1000 * 60 * 60));
        const roundedDays = Math.round(timeDiff / (1000 * 60 * 60 * 24));

        if (minutes < 1) {
            return 'Few seconds ago';
        }

        if (roundedMinutes < 60) {
            return roundedMinutes === 1 ? '1 minute ago' : `${roundedMinutes} minutes ago`;
        }

        if (roundedHours < 24) {
            return roundedHours === 1 ? '1 hour ago' : `${roundedHours} hours ago`;
        }

        if (roundedDays <= 7) {
            return roundedDays === 1 ? '1 day ago' : `${roundedDays} days ago`;
        }

        const createdYear = createdDateTime.getFullYear();
        const currentYear = currentDateTime.getFullYear();
        
        const month = createdDateTime.toLocaleString('default', { month: 'long' });
        const day = createdDateTime.getDate();
        
        return createdYear < currentYear 
            ? `${month} ${day}, ${createdYear}`
            : `${month} ${day}`;
    } catch (error) {
        console.error('Error in formatTimeStamp:', error);
        return '';
    }
};

export const formatCount = (count) => {
    if (!count || count === 0) return '0';

    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return count.toString();
};

// Session Storage utilities
export const getItemFromSS = (key) => {
    if (typeof Storage !== 'undefined') {
        return sessionStorage.getItem(key);
    } else {
        console.error('Session storage not found');
        return null;
    }
};

export const setItemInSS = (key, val) => {
    if (typeof Storage !== 'undefined') {
        sessionStorage.setItem(key, val);
    } else {
        console.error('Session storage not found');
    }
};

export const removeItemFromSS = (key) => {
    if (typeof Storage !== 'undefined') {
        sessionStorage.removeItem(key);
    } else {
        console.error('Session storage not found');
    }
};

// URL creation utilities
export const createMinisArticlePlayerUrl = (slug, source_id, continuationId, extraParams = {}) => {
    const MINIS_ARTICLE_PLAYER_URL = '/minis/article-[caption]-aid-[articleId]';
    let minisArticlePlayerUrl = MINIS_ARTICLE_PLAYER_URL;
    
    if (slug) {
        const urlCaption = slug
            ?.toLowerCase()
            ?.replace(/[^\w\s]/gi, '-') // Replace non-word/space chars with hyphen
            ?.replace(/\s+/g, '-') // Replace spaces with hyphen
            ?.replace(/-+/g, '-') // Replace multiple hyphens with one
            ?.replace(/^-|-$/g, ''); // Optional: Remove hyphens from start/end

        minisArticlePlayerUrl = minisArticlePlayerUrl.replace('[caption]', urlCaption);
    }
    if (source_id) {
        minisArticlePlayerUrl = minisArticlePlayerUrl.replace('[articleId]', source_id);
    }

    if (continuationId) {
        minisArticlePlayerUrl += `?continuationId=${continuationId}`;
    }

    let extraQueryParams = '';
    for (const key in extraParams) {
        if (extraParams.hasOwnProperty(key)) {
            extraQueryParams += `&${key}=${encodeURIComponent(extraParams[key])}`;
        }
    }

    return minisArticlePlayerUrl + extraQueryParams;
};

export const createSlidePlayerUrl = (caption, source_id, index, continuationId = '', extraParams = {}) => {
    const MINI_SLIDE_PLAYER_URL = '/minis/slide-[caption]-sid-[slideId]';
    
    if (caption) {
        const urlCaption = caption
            ?.toLowerCase()
            ?.replace(/[^\w\s]/gi, '-')
            ?.replace(/\s+/g, '-');
        let slideFullScreenUrl = MINI_SLIDE_PLAYER_URL.replace('[slideId]', source_id)
            .replace('[caption]', urlCaption)
            ?.replace(/-+/g, '-');

        slideFullScreenUrl += `?slideSeq=${index || 0}`;

        if (continuationId) {
            slideFullScreenUrl += `&continuationId=${continuationId}`;
        }

        const extraQueryParams = Object.entries(extraParams || {})
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
            .join('');

        return slideFullScreenUrl + extraQueryParams;
    }
};

export const createUrlWithQueryParams = (rawUrl, queryObj) => {
    const queryArr = [];
    Object.keys(queryObj).map(key => {
        if (key) {
            return queryArr.push(key + '=' + queryObj[key]);
        }
        return null;
    });
    if (rawUrl.includes('?')) {
        return rawUrl + '&' + queryArr.join('&');
    } else {
        return rawUrl + '?' + queryArr.join('&');
    }
};

export const getQueryObj = () => {
    let query;
    if (window.location.search) {
        try {
            const search = window.location.search.substring(1);
            query = JSON.parse(
                '{"' +
                    decodeURI(search)
                        .replace(/"/g, '\\"')
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"') +
                    '"}'
            );
        } catch (e) {
            query = getQueryParams(window.location.search);
        }
    }
    return query || {};
};

export const redirectToAppPage = (url, handlePwaRedirection) => {
    if (
        typeof window.webkit !== 'undefined' &&
        window.webkit.messageHandlers?.naukriAppNavigationHandler?.postMessage
    ) {
        window.webkit.messageHandlers.naukriAppNavigationHandler.postMessage({
            ctaName: 'openApp',
            pageNavigation: `https://www.naukri.com${url}`,
            isReload: true,
            keepWebview: true,
            msg: ''
        });
    } else if (
        typeof window.JSUtilityInterface !== 'undefined' &&
        window.JSUtilityInterface.naukriAppNavigationHandlerWithStack
    ) {
        window.JSUtilityInterface.naukriAppNavigationHandlerWithStack(
            'pageNavigation',
            `https://www.naukri.com${url}`,
            true,
            '',
            false
        );
    } else {
        handlePwaRedirection ? handlePwaRedirection() : (window.location.href = url);
    }
};

export const navigateToPage = (url, router) => {
    if (window.location.pathname !== url) {
        history.pushState({}, '', url); // Ensure a proper history entry
        window.location.href = url;
    }
};

// Video utility functions
export const createVideoPlayerUrl = (caption, source_id, index, continuationId, extraParams = {}) => {
    const MINI_VIDEO_PLAYER_URL = '/minis/video-[caption]-vid-[videoId]';
    
    if (caption) {
        const urlCaption = caption
            ?.toLowerCase()
            ?.replace(/[^\w\s]/gi, '-')
            ?.replace(/\s+/g, '-')
            ?.replace(/-+/g, '-');
        let videoFullScreenUrl = MINI_VIDEO_PLAYER_URL.replace('[videoId]', source_id)
            .replace('[caption]', urlCaption);

        videoFullScreenUrl += `?vseq=${index || 0}`;

        if (continuationId) {
            videoFullScreenUrl += `&continuationId=${continuationId}`;
        }

        const extraQueryParams = Object.entries(extraParams || {})
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
            .join('');

        return videoFullScreenUrl + extraQueryParams;
    }
    return '';
};

// Player control event management
export const addPlayerControlEvent = (muteStatus) => {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('playerControlEvent', {
            detail: { muted: muteStatus }
        });
        window.dispatchEvent(event);
    }
};

// Current player video data management
export const addCurrentPlayerVidInStorage = (key, sourceId) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify({ source_id: sourceId }));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
};

export const getCurrentPlayerVidData = (key) => {
    if (typeof window !== 'undefined') {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }
    return null;
};

// Query parameter utilities
export const getQueryParams = (search) => {
    if (!search) return {};
    
    const params = new URLSearchParams(search);
    const result = {};
    
    for (const [key, value] of params) {
        result[key] = value;
    }
    
    return result;
};

// Local Storage utilities for likes/bookmarks data
export const getLikesData = (key) => {
    if (typeof window !== 'undefined') {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : { likes: {}, bookmarks: {} };
        } catch (error) {
            console.error('Error reading likes data:', error);
            return { likes: {}, bookmarks: {} };
        }
    }
    return { likes: {}, bookmarks: {} };
};

export const saveLikesData = (key, payload) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(payload));
        } catch (error) {
            console.error('Error saving likes data:', error);
        }
    }
};

// Share URL utility
export const shareUrl = ({ url, title, utms = {} }) => {
    if (typeof window !== 'undefined' && navigator.share) {
        // Use native share API if available
        navigator.share({
            title,
            url
        }).catch(console.error);
    } else {
        // Fallback to copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                console.log('URL copied to clipboard');
            }).catch(console.error);
        } else {
            console.log('Share URL:', { url, title, utms });
        }
    }
};

