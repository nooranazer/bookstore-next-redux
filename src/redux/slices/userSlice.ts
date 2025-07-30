import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { UserType } from "@/types/UserType";

interface UserState {
  user: UserType | null;
  loading: boolean;
  error: string | null;
}


//  Initial state
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Thunk to fetch user profile
export const viewProfile = createAsyncThunk<UserType, string>(
  'user/viewprofile',
  async (token) => {
    const res = await api.get('/user/viewprofile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data.data;
  }
)

//slice
const userSlice =  createSlice({
    name:'user',
    initialState: initialState,
    reducers: {},
    extraReducers: builder =>  {
        builder

        //viewprofile
        .addCase(viewProfile.pending, (state) => {
            state.loading = true;
            state.error = null
        })

         .addCase(viewProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
              })
        .addCase(viewProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch profile';
         })
        
    },
})

