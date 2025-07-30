import { configureStore } from '@reduxjs/toolkit';
import BookReducer from '@/redux/slices/bookSlice'

 export const store = configureStore({
    reducer: {
        books: BookReducer,
        
        
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;