import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api'
import BookType, { AddBookType } from '@/types/BookType';
import toast from 'react-hot-toast';


interface BookState {
  books: BookType[];
  book: BookType | null;
  loading: boolean;
  error: string | null;
  isRefresh: boolean;
  totalPages: number
}


//initial state
const initialState: BookState = {
    books: [],
    book: null,
    loading: false,
    error: null,
    isRefresh: false,
    totalPages: 1

}

// define return type for thunk
interface ListBooksResponse {
  data: BookType[];
  totalPages: number;
}

//thunks or actions

//listbook
export const listBooks = createAsyncThunk<ListBooksResponse, { currentPage: number; token: string }>(
  'books/list',
  async ({ currentPage, token }) => {
    const res = await api.get(`/books/list?page=${currentPage}&limit=3`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: res.data.data,
      totalPages: res.data.totalPages,
    };
  }
);

//  get one book
export const getBook = createAsyncThunk<BookType, { id: string; token: string }>(
  'books/get',
  async ({ id, token }) => {
    const res = await api.get(`books/view/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }
);

//add book
export const addBook = createAsyncThunk('books/add',async ({formData, token}: { formData: FormData; token: string },) => {

   const res = await api.post('/books/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
})
return res.data.data;
})

// edit book
export const editBook = createAsyncThunk(
  'books/edit',
  async (
    { token, formData, id }: { formData: FormData; token: string; id: string }
  ) => {
    const res = await api.patch(`/books/update/${id}`, formData, {
      
      headers: {
        Authorization: `Bearer ${token}`,
      },
    
    });
    return res.data.data;
  }
);

// delete book
export const deleteBook = createAsyncThunk(
  'books/delete',
  async ({ token, id }: { token: string; id: string }) => {
    const res =  api
      .delete(`/books/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    return id; // return the deleted book ID
  }
);



//slice

const bookSlice = createSlice({
    name: 'books',
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder

        //listbooks
      .addCase(listBooks.pending, state => {
        state.loading = true;
      })
      .addCase(listBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(listBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to list books';
      })

      //get one book
       .addCase(getBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(getBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch book';
      })

      //addbook
      .addCase(addBook.pending,(state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addBook.fulfilled, (state,action) => {
        state.loading = false;
        state.books.push(action.payload);
        state.isRefresh = true;
      })

      .addCase(addBook.rejected,(state,action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add book';
      })

      //edit book
      .addCase(editBook.pending,(state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBook.fulfilled,(state,action ) => {
        state.loading = false;
        const updatedBook = action.payload
        state.books = state.books.map((book) => (
        book._id === updatedBook.id ? updatedBook : book
        ))

      })
      .addCase(editBook.rejected, (state,action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add book'

      })

      //deletebook
      .addCase(deleteBook.pending,(state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        const deletedBookId = action.payload;
        state.books = state.books.filter((book) => book._id !== deletedBookId);
      })

      .addCase(deleteBook.rejected, (state,action) => {
        state.loading = false;
        state.error = action.error.message || 'failed to delete'
      })



        
    },


})


export default bookSlice.reducer;
