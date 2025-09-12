import {
    FEED_FETCH_REQUEST,
    FEED_FETCH_SUCCESS,
    FEED_FETCH_FAILURE,
    UPDATE_FEED_INTERACTION,
    TOGGLE_VIDEO_AUDIO,
    UPDATE_CURRENT_PAGE
} from './types';
import ajaxWrapper from '../../../utils/ajax';
import { UNIFIED_API_CONSTANTS } from '../../NaukriMinis/constants';
import { getQueryParams } from '../../../utils';
import { DEFAULT_TAGS_QPARAM } from '../constants';
import { pageSizeConfig } from '../constants';
import { NG_TAGS } from '../constants';


// Simulate API call for unified feed
const simulateUnifiedFeedAPI = async ({ page, filters, loginStatus, articleIds, contentIds, topType }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data structure matching 135
    const mockRecords = [
        {
            content: {
                source_id: `article_${page}_1`,
                content_id: `content_${page}_1`,
                title: 'Latest Tech News: AI Revolutionizes Software Development',
                description: 'Discover how artificial intelligence is transforming the way we develop software...',
                media_url: 'https://via.placeholder.com/400x200',
                url: '/article/ai-software-development',
                vendor_created_at: new Date().toISOString(),
                source_info: {
                    name: 'TechCrunch',
                    logo: 'https://via.placeholder.com/32x32',
                    verified: true,
                    id: 'techcrunch',
                    is_subscribed: false,
                    is_subscribe_allowed: true
                },
                curated_tags: ['Technology', 'AI'],
                interaction_data: {
                    like: { count: 42, status: false },
                    save: { count: 15, status: false },
                    share: { count: 8, status: false },
                    view: { count: 1250, status: false }
                }
            },
            metadata: {
                content_type: 'articles',
                vendor: 'minis'
            }
        },
        {
            content: {
                source_id: `video_${page}_1`,
                content_id: `content_${page}_2`,
                title: 'React Performance Tips',
                caption: 'Learn the best practices for optimizing React applications for better performance...',
                streaming_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                thumbnail_url: 'https://via.placeholder.com/400x600',
                url: '/video/react-performance',
                vendor_created_at: new Date().toISOString(),
                source_info: {
                    name: 'React Official',
                    logo: 'https://via.placeholder.com/32x32',
                    verified: true,
                    id: 'react-official',
                    is_subscribed: false,
                    is_subscribe_allowed: true
                },
                interaction_data: {
                    like: { count: 89, status: false },
                    save: { count: 32, status: false },
                    share: { count: 16, status: false },
                    view: { count: 2100, status: false }
                }
            },
            metadata: {
                content_type: 'reels',
                vendor: 'minis'
            }
        },
        {
            content: {
                source_id: `article_${page}_2`,
                content_id: `content_${page}_3`,
                title: 'Web Development Trends 2024',
                description: 'Explore the latest trends in web development that will shape the industry...',
                media_url: 'https://via.placeholder.com/400x200',
                url: '/article/web-dev-trends-2024',
                vendor_created_at: new Date().toISOString(),
                source_info: {
                    name: 'Dev.to',
                    logo: 'https://via.placeholder.com/32x32',
                    verified: false,
                    id: 'devto',
                    is_subscribed: false,
                    is_subscribe_allowed: true
                },
                curated_tags: ['Web Development', 'Trends'],
                interaction_data: {
                    like: { count: 67, status: false },
                    save: { count: 23, status: false },
                    share: { count: 12, status: false },
                    view: { count: 980, status: false }
                }
            },
            metadata: {
                content_type: 'articles',
                vendor: 'minis'
            }
        },
        {
            content: {
                source_id: `webstory_${page}_1`,
                content_id: `content_${page}_4`,
                title: '5 JavaScript Tips',
                description: 'Essential JavaScript tips every developer should know',
                media_url: 'https://via.placeholder.com/400x600',
                url: '/webstory/js-tips',
                vendor_created_at: new Date().toISOString(),
                image_data: [
                    { url: 'https://via.placeholder.com/400x600' },
                    { url: 'https://via.placeholder.com/400x600' },
                    { url: 'https://via.placeholder.com/400x600' }
                ],
                background_url: 'https://via.placeholder.com/400x600',
                source_info: {
                    name: 'JavaScript Weekly',
                    logo: 'https://via.placeholder.com/32x32',
                    verified: true,
                    id: 'js-weekly',
                    is_subscribed: false,
                    is_subscribe_allowed: true
                },
                interaction_data: {
                    like: { count: 34, status: false },
                    save: { count: 11, status: false },
                    share: { count: 5, status: false },
                    view: { count: 678, status: false }
                }
            },
            metadata: {
                content_type: 'web_stories',
                vendor: 'minis'
            }
        }
    ];

    return {
        items: {
            records: mockRecords,
            total: 50, // Total available items
            page,
            size: 4
        },
        hasMore: page < 5, // Has more pages
        filters: [
            { id: 'tech', name: 'Technology', selected: false },
            { id: 'ai', name: 'AI', selected: false },
            { id: 'web', name: 'Web Development', selected: false }
        ],
        savedCount: 12
    };
};

// Fetch unified feed action
export const fetchUnifiedFeed = ({ page = 1, filters = {}, loginStatus, articleIds = [], contentIds = [], topType = 'articles' }) => {
    return async (dispatch) => {
        try {
            const mode = filters.mode || 'Work';
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            let url = `${API_BASE_URL}/api/unified-feed?filter=true&flow=minis_homepage`;
            url += `&flow=${UNIFIED_API_CONSTANTS.FLOW}`;
            const topIds = articleIds.length > 0 ? articleIds : contentIds;
            if (articleIds.length > 0) {
                url += '&topType=articles';
            }
            if (contentIds.length > 0) {
                url += `&topType=${topType}`;
            }

            let fetchWithDefaultTags = false;
            const queryParams = getQueryParams(window.location.search);
            const defaultSelectedTags = queryParams?.[DEFAULT_TAGS_QPARAM]?.trim()?.split(',');

            if (Array.isArray(defaultSelectedTags) && defaultSelectedTags.length > 0 && !filters.saved) {
                fetchWithDefaultTags = true;
            }
            dispatch({ type: FEED_FETCH_REQUEST, payload: { mode: filters.mode || 'Work' } });
            
            // const response = await simulateUnifiedFeedAPI({
            //     page,
            //     filters,
            //     loginStatus,
            //     articleIds,
            //     contentIds,
            //     topType
            // });

            const requestBody = {
                metadata: [
                    {
                        content_type: 'UNIFIED',
                        vendor: 'minis',
                        mode
                    }
                ],
                tags: filters.tags || [],
                curated_tags: filters.curated_tags || [],
                source_ids: {
                    include: filters.sourceIds || [],
                    top:
                        page === 1 && topIds.length > 0 && !fetchWithDefaultTags && !filters.saved
                            ? topIds
                            : []
                },
                config: {
                    page,
                    size: 20
                },
                saved: filters.saved || false,
                curated_tags: filters.curated_tags || []
            };

            const response = await ajaxWrapper({
                url,
                method: 'POST',
                body: requestBody,
                headers: {
                    systemId: 'jobseeker',
                    'Content-Type': 'application/json'
                },
                bearerToken: true,
                do401Handling: true,
                returnCompRes: true
            });

            const data = await response.json();
            
            dispatch({
                type: FEED_FETCH_SUCCESS,
                payload: {
                    ...data,
                    mode: filters.mode || 'Work',
                    page,
                    append: page > 1
                }
            });
            
            return response;
        } catch (error) {
            dispatch({
                type: FEED_FETCH_FAILURE,
                payload: { error: error.message, mode: filters.mode || 'Work' }
            });
            throw error;
        }
    };
};

// Make interaction call (simplified)
export const makeInteractionCall = async (payload, isLoggedIn) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For standalone, always return success
    console.log('Interaction call:', payload);
    return 'Success';
};

// Update interaction
export const updateInteraction = (feedItem, type) => {
    if (feedItem?.interaction_data?.[type]) {
        feedItem.interaction_data[type].count += 1;
        feedItem.interaction_data[type].status = !feedItem.interaction_data[type].status;
    }
};

// Toggle video audio
export const toggleVideoAudio = (status) => ({
    type: TOGGLE_VIDEO_AUDIO,
    payload: { status }
});

// Update current page
export const updateCurrentPage = (page) => ({
    type: UPDATE_CURRENT_PAGE,
    payload: { page }
});

// Get login status (simplified for standalone)
export const getLoginStatus = (dispatch, callback) => {
    // For standalone, always return logged out status
    const loginStatus = { isLoggedIn: false, syncDone: true };
    if (callback) callback(loginStatus);
    return loginStatus;
};
