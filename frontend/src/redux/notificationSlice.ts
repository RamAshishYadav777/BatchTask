import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error';

export interface NotificationState {
    type: NotificationType;
    message: string;
    isOpen: boolean;
}

const initialState: NotificationState = {
    type: 'success',
    message: '',
    isOpen: false,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action: PayloadAction<{ type: NotificationType; message: string }>) => {
            state.type = action.payload.type;
            state.message = action.payload.message;
            state.isOpen = true;
        },
        hideNotification: (state) => {
            state.isOpen = false;
        },
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
