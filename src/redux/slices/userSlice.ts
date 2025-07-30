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

// Thunk 
// view profile
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

// Edit profile thunk
export const editProfile = createAsyncThunk<UserType, 
  { formData: FormData; token: string } // argument type
>(
  'user/editProfile',
  async ({ formData, token }) => {
    const res = await api.patch('/user/editprofile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data.data
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

        .addCase(editProfile.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(editProfile.fulfilled, (state, action) => {
          state.loading = false
          state.user = action.payload 
        })
        .addCase(editProfile.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to update profile'
        })

        
    },
})

export default userSlice.reducer;

