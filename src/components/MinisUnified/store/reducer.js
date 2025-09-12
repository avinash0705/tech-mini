import {
    FEED_FETCH_REQUEST,
    FEED_FETCH_SUCCESS,
    FEED_FETCH_FAILURE,
    UPDATE_FEED_INTERACTION,
    TOGGLE_VIDEO_AUDIO,
    UPDATE_CURRENT_PAGE,
    UPDATE_SAVE_COUNT,
    TOGGLE_ASK_SIGN_IN_MODAL
} from './types';

const initialState = {
    workFeed: {
        items: {
            records: [],
            total: 0,
            page: 1,
            size: 10
        },
        hasMore: true,
        filters: [],
        savedCount: 0,
        loading: false,
        error: null
    },
    playFeed: {
        items: {
            records: [],
            total: 0,
            page: 1,
            size: 10
        },
        hasMore: true,
        filters: [],
        savedCount: 0,
        loading: false,
        error: null
    },
    isMuted: true,
    storeCurrentPage: 1,
    showAskSignInModal: false
};

const minisUnifiedReducer = (state = initialState, action) => {
    switch (action.type) {
        case FEED_FETCH_REQUEST: {
            const { mode } = action.payload;
            const feedKey = mode === 'Play' ? 'playFeed' : 'workFeed';
            
            return {
                ...state,
                [feedKey]: {
                    ...state[feedKey],
                    loading: true,
                    error: null
                }
            };
        }

        case FEED_FETCH_SUCCESS: {
            const { mode, page, append, ...response } = action.payload;
            const feedKey = mode === 'Play' ? 'playFeed' : 'workFeed';
            let currentFeedState = state[feedKey];

            return {
                ...state,
                [feedKey]: {
                    ...currentFeedState,
                    items: {
                        records: action.payload.append
                            ? [
                                  ...currentFeedState.items.records,
                                  ...(action.payload?.records || [])
                              ]
                            : action.payload?.records || [],
                        config: action.payload?.config || {}
                    },
                    fillers: action.payload?.fillers,
                    page: action.payload?.config?.page || currentFeedState.page,
                    hasMore: !(action.payload?.config?.is_repeated === false),
                    loading: false,
                    error: null,
                    savedCount: action.payload?.saved_count || 0
                }
            };
        }

        case FEED_FETCH_FAILURE: {
            const { error, mode } = action.payload;
            const feedKey = mode === 'Play' ? 'playFeed' : 'workFeed';
            
            return {
                ...state,
                [feedKey]: {
                    ...state[feedKey],
                    loading: false,
                    error
                }
            };
        }

        case UPDATE_FEED_INTERACTION: {
            const { itemId, type, status, count } = action.payload;
            
            // Update both feeds if the item exists
            const updateFeedInteraction = (feed) => ({
                ...feed,
                items: {
                    ...feed.items,
                    records: feed.items.records.map(record => {
                        if (record.content.id === itemId) {
                            return {
                                ...record,
                                content: {
                                    ...record.content,
                                    interaction_data: {
                                        ...record.content.interaction_data,
                                        [type]: {
                                            ...record.content.interaction_data?.[type],
                                            count,
                                            status
                                        }
                                    }
                                }
                            };
                        }
                        return record;
                    })
                }
            });

            return {
                ...state,
                workFeed: updateFeedInteraction(state.workFeed),
                playFeed: updateFeedInteraction(state.playFeed)
            };
        }

        case TOGGLE_VIDEO_AUDIO: {
            const { status } = action.payload;
            return {
                ...state,
                isMuted: status
            };
        }

        case UPDATE_CURRENT_PAGE: {
            const { page } = action.payload;
            return {
                ...state,
                storeCurrentPage: page
            };
        }

        case UPDATE_SAVE_COUNT: {
            const { mode, count } = action.payload;
            const feedKey = mode === 'Play' ? 'playFeed' : 'workFeed';
            
            return {
                ...state,
                [feedKey]: {
                    ...state[feedKey],
                    savedCount: count
                }
            };
        }

        case TOGGLE_ASK_SIGN_IN_MODAL: {
            const { show } = action.payload;
            return {
                ...state,
                showAskSignInModal: show
            };
        }

        default:
            return state;
    }
};

export default minisUnifiedReducer;
