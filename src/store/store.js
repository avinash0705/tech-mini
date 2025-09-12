import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createWrapper } from 'next-redux-wrapper';

// Import reducers
import minisReducer from './reducers/minisReducer';
import userReducer from './reducers/userReducer';
import minisUnifiedReducer from '../components/MinisUnified/store/reducer';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'] // Only persist user data
};

const rootReducer = combineReducers({
    minis: minisReducer,
    user: userReducer,
    minisUnified: minisUnifiedReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                },
            }),
    });
    
    store.__persistor = persistStore(store);
    return store;
};

export const wrapper = createWrapper(makeStore);
export default makeStore;
