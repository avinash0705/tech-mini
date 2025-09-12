// Minis Reducer
const initialState = {
    minisData: {},
    minisDataError: false,
    minisDataLoading: false,
    filters: [],
    selectedFilters: [],
    savedItems: [],
    currentPage: 1,
    hasMore: true
};

const minisReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_MINIS_REQUEST':
            return {
                ...state,
                minisDataLoading: true,
                minisDataError: false
            };
            
        case 'FETCH_MINIS_SUCCESS':
            return {
                ...state,
                minisDataLoading: false,
                minisData: action.payload,
                minisDataError: false
            };
            
        case 'FETCH_MINIS_FAILURE':
            return {
                ...state,
                minisDataLoading: false,
                minisDataError: action.payload
            };
            
        case 'UPDATE_FILTERS':
            return {
                ...state,
                filters: action.payload
            };
            
        case 'UPDATE_SELECTED_FILTERS':
            return {
                ...state,
                selectedFilters: action.payload
            };
            
        case 'UPDATE_SAVED_ITEMS':
            return {
                ...state,
                savedItems: action.payload
            };
            
        case 'UPDATE_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.payload
            };
            
        case 'UPDATE_HAS_MORE':
            return {
                ...state,
                hasMore: action.payload
            };
            
        case 'RESET_MINIS_DATA':
            return {
                ...initialState
            };
            
        default:
            return state;
    }
};

export default minisReducer;
