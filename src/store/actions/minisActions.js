import ajaxWrapper from '../../utils/ajax';
import {
    MINIS_DATA_LOGGEDIN_API,
    MINIS_DATA_LOGGEDOUT_API,
    MINIS_ACTION_LOGGEDIN_API,
    MINIS_ACTION_LOGGEDOUT_API
} from '../../config/browserConfig';
import { MINIS_API_CONSTANTS, UNIFIED_API_CONSTANTS } from '../../components/NaukriMinis/constants';
import { getQueryParams } from '../../utils';

// Action Types
export const FETCH_MINIS_REQUEST = 'FETCH_MINIS_REQUEST';
export const FETCH_MINIS_SUCCESS = 'FETCH_MINIS_SUCCESS';
export const FETCH_MINIS_FAILURE = 'FETCH_MINIS_FAILURE';
export const UPDATE_FILTERS = 'UPDATE_FILTERS';
export const UPDATE_SELECTED_FILTERS = 'UPDATE_SELECTED_FILTERS';
export const UPDATE_SAVED_ITEMS = 'UPDATE_SAVED_ITEMS';
export const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE';
export const UPDATE_HAS_MORE = 'UPDATE_HAS_MORE';
export const RESET_MINIS_DATA = 'RESET_MINIS_DATA';

// Action Creators
export const fetchMinisRequest = () => ({
    type: FETCH_MINIS_REQUEST
});

export const fetchMinisSuccess = (data) => ({
    type: FETCH_MINIS_SUCCESS,
    payload: data
});

export const fetchMinisFailure = (error) => ({
    type: FETCH_MINIS_FAILURE,
    payload: error
});

export const updateFilters = (filters) => ({
    type: UPDATE_FILTERS,
    payload: filters
});

export const updateSelectedFilters = (filters) => ({
    type: UPDATE_SELECTED_FILTERS,
    payload: filters
});

export const updateSavedItems = (items) => ({
    type: UPDATE_SAVED_ITEMS,
    payload: items
});

export const updateCurrentPage = (page) => ({
    type: UPDATE_CURRENT_PAGE,
    payload: page
});

export const updateHasMore = (hasMore) => ({
    type: UPDATE_HAS_MORE,
    payload: hasMore
});

export const resetMinisData = () => ({
    type: RESET_MINIS_DATA
});

// Async Actions
export const fetchMinisData = ({
    loginStatus = false,
    config = { page: 1, size: 15 },
    premium = false,
    saved = false,
    selectedFilters = [],
    topArticleIds = [],
    passTopArticleIds = false,
    flow = MINIS_API_CONSTANTS.FLOW
}) => {
    return async (dispatch, getState) => {
        dispatch(fetchMinisRequest());
        
        try {
            const MINIS_API = loginStatus ? MINIS_DATA_LOGGEDIN_API : MINIS_DATA_LOGGEDOUT_API;
            
            const queryParams = getQueryParams(window.location?.search || '');
            let defaultSelectedTags = queryParams?.default_tags?.trim();
            
            if (defaultSelectedTags) {
                defaultSelectedTags = defaultSelectedTags.split(',');
            }
            
            let hideTopIds = false;
            if (passTopArticleIds) {
                hideTopIds = false;
            } else {
                hideTopIds = saved || selectedFilters.length;
            }
            
            const data = {
                metadata: [
                    {
                        content_type: 'articles',
                        media_type: 'text',
                        vendor: 'minis'
                    }
                ],
                saved: saved,
                tags: defaultSelectedTags ? defaultSelectedTags : [],
                trending: true,
                source_ids: {
                    include: [],
                    exclude: [],
                    top: hideTopIds ? [] : topArticleIds
                },
                config,
                curated_tags: saved ? [] : selectedFilters
            };
            
            if (premium) {
                data.dynamic_params = {
                    premium: true
                };
            }
            
            const response = await ajaxWrapper({
                url: MINIS_API + `?filter=true&flow=${flow}`,
                method: 'POST',
                headers: {
                    systemid: 'naukriIndia'
                },
                body: data,
                bearerToken: true,
                do401Handling: true
            });
            
            if (response?.error) {
                dispatch(fetchMinisFailure(response.error));
            } else {
                dispatch(fetchMinisSuccess(response));
            }
            
            return response;
        } catch (error) {
            dispatch(fetchMinisFailure(error));
            return { error };
        }
    };
};

export const fetchUnifiedFeed = ({
    loginStatus = false,
    config = { page: 1, size: 10 },
    selectedFilters = [],
    flow = UNIFIED_API_CONSTANTS.FLOW
}) => {
    return async (dispatch) => {
        dispatch(fetchMinisRequest());
        
        try {
            const UNIFIED_API = loginStatus ? MINIS_DATA_LOGGEDIN_API : MINIS_DATA_LOGGEDOUT_API;
            
            const data = {
                metadata: [
                    {
                        content_type: 'UNIFIED',
                        media_type: 'text',
                        vendor: 'minis'
                    }
                ],
                saved: false,
                tags: [],
                trending: true,
                source_ids: {
                    include: [],
                    exclude: [],
                    top: []
                },
                config,
                curated_tags: selectedFilters
            };
            
            const response = await ajaxWrapper({
                url: UNIFIED_API + `?filter=true&flow=${flow}`,
                method: 'POST',
                headers: {
                    systemid: 'naukriIndia'
                },
                body: data,
                bearerToken: true,
                do401Handling: true
            });
            
            if (response?.error) {
                dispatch(fetchMinisFailure(response.error));
                
            } else {
                dispatch(fetchMinisSuccess(response));
            }
            
            return response;
        } catch (error) {
            dispatch(fetchMinisFailure(error));
            return { error };
        }
    };
};

export const fetchMinisHomepageFeed = async (config = { page: 1, size: 15 }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = `${API_BASE_URL}/api/feed?filter=true&flow=minis_homepage`
    
    // Body structure from your working curl command
    const body = {
        "metadata": [
            {
                "content_type": "articles",
                "media_type": "text",
                "vendor": "minis"
            }
        ],
        "saved": false,
        "tags": [],
        "trending": true,
        "source_ids": {
            "include": [],
            "exclude": [],
            "top": []
        },
        "config": {
            "page": config.page,
            "size": config.size
        },
        "curated_tags": []
    };
    
    try {
        console.log('🚀 Calling API server:', url);
        console.log('📦 Body being sent:', JSON.stringify(body, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ Success! Data received:', data);
        return data;
    } catch (error) {
        console.error('💥 Error fetching minis homepage feed:', error);
        throw error;
    }
};

export const fetchUnifiedMiniFeed = async (config = { page: 1, size: 10 }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = `${API_BASE_URL}/api/unified-feed?filter=true&flow=minis_unified`
    
    // Body structure from your working curl command
    const body = {
        "metadata": [
            {
                "content_type": "UNIFIED_LOGGED_OUT",
                "vendor": "minis", 
                "mode": "Work"
            }
        ],
        "tags": [],
        "curated_tags": [],
        "source_ids": {
            "include": [],
            "top": []
        },
        "config": {
            "page": config.page,
            "size": config.size
        },
        "saved": false
    };
    
    try {
        console.log('🚀 Calling API server:', url);
        console.log('📦 Body being sent:', JSON.stringify(body, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ Success! Data received:', data);
        return data;
    } catch (error) {
        console.error('💥 Error fetching unified mini feed:', error);
        throw error;
    }
};

export const makeInteractionCall = (payload, loginStatus = false) => {
    return async (dispatch) => {
        try {
            const INTERACT_API = loginStatus ? MINIS_ACTION_LOGGEDIN_API : MINIS_ACTION_LOGGEDOUT_API;
            
            const response = await ajaxWrapper({
                url: INTERACT_API,
                method: 'POST',
                headers: {
                    systemid: 'naukriIndia'
                },
                body: payload,
                bearerToken: true,
                do401Handling: true
            });
            
            return response;
        } catch (error) {
            return { error };
        }
    };
};
