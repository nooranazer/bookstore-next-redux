import { configureStore } from '@reduxjs/toolkit';
import BookReducer from '@/redux/slices/bookSlice'
import  userReducer from '@/redux/slices/userSlice'

 export const store = configureStore({
    reducer: {
        books: BookReducer,
        user: userReducer, 
        
        
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;