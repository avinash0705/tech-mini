// User Reducer
const initialState = {
    isLoggedIn: false,
    userDetails: null,
    loginStatus: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LOGIN_STATUS':
            return {
                ...state,
                isLoggedIn: action.payload,
                loginStatus: action.payload
            };
            
        case 'SET_USER_DETAILS':
            return {
                ...state,
                userDetails: action.payload
            };
            
        case 'LOGOUT':
            return {
                ...initialState
            };
            
        default:
            return state;
    }
};

export default userReducer;
