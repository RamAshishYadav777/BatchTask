import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
    reducer: {
        filters: filterReducer,
        notification: notificationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
