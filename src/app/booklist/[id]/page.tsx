'use client'

import api from '@/lib/api'
import { deleteBook, getBook } from '@/redux/slices/bookSlice'
import { AppDispatch, RootState } from '@/redux/store'
import BookType from '@/types/BookType'
import { Edit, Delete, ArrowBack, CurrencyRupee, Category, Star } from '@mui/icons-material'
import { Chip } from '@mui/material'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Box,
} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ViewBook = () => {
  const { id } = useParams()
  const router = useRouter()

  // const [book, setBook] = useState<BookType | null>(null)
  const [user, setUser] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const dispatch = useDispatch<AppDispatch>();
  const { book, loading } = useSelector((state: RootState) => state.books);



  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (id && token) {
        dispatch(getBook({ id: id.toString(), token }));
      }
    }, [id, dispatch])

      // api
      //   .get(`books/view/${id}`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   })
      //   .then((res) => setBook(res.data.data))
      //   .catch((err) =>
      //     console.error('Error fetching book:', err.response?.data || err.message)
      //   )

  const handleDelete = () => {
    const token = localStorage.getItem('token')
    if (token)
    dispatch(deleteBook({ token, id: id as string }))
    .unwrap()
    .then(() => {
    setOpenDialog(false)
    router.push('/booklist')
    })
   .catch((err) =>
    console.error('Error deleting book:', err.response?.data || err.message)
    )
   }
    // api
    //   .delete(`/books/delete/${id}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
      // .then(() => {
      //   setOpenDialog(false)
      //   router.push('/booklist')
      // })
      // .catch((err) =>
      //   console.error('Error deleting book:', err.response?.data || err.message)
      // )

  const role = user?.role

  if (!book) {
    return <div className="p-6 text-center">Loading book details...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Box className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Link href="/booklist">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Back
            </Button>
          </Link>
        </Box>

        {/* Book Info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          {/* Image */}
          <Box
            sx={{
              flex: '0 0 300px',
              height: 450,
              overflow: 'hidden',
              borderRadius: 4,
              boxShadow: 3,
              mx: 'auto',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${book.image}`}
                alt={book.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="textPrimary" gutterBottom>
  {book.title}
</Typography>

<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
  <strong>Author:</strong> {book.authorname}
</Typography>

<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
  <CurrencyRupee fontSize="small" color="action" />
  <Typography variant="subtitle1" color="green">
    {book.price}
  </Typography>
</Stack>

<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
  <Star fontSize="small" sx={{ color: '#fbbf24' }} />
  <Typography variant="subtitle1" color="text.secondary">
    {book.rating} / 5
  </Typography>
</Stack>

<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
  <Category fontSize="small" color="action" />
  <Chip label={book.category} color="info" size="small" />
</Stack>

<Typography variant="body1" color="text.primary" sx={{ mt: 3, whiteSpace: 'pre-line' }}>
  {book.description}
</Typography>


            {/* Seller Controls */}
            {role === 'seller' && (
              <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                <Link href={`/booklist/${id}/editbook`}>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<Edit />}
                    sx={{ textTransform: 'none', fontWeight: '500', px: 3 }}
                  >
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setOpenDialog(true)}
                  sx={{ textTransform: 'none', fontWeight: '500', px: 3 }}
                >
                  Delete
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{book.title}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ViewBook
