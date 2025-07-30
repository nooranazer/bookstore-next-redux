'use client'
import api from '@/lib/api'
import BookType, { AddBookType } from '@/types/BookType'
import {
  Box, Button, TextField, Typography, Paper, MenuItem
} from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { editBook, getBook } from '@/redux/slices/bookSlice'


const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  authorname: yup.string().required('Author name is required'),
  price: yup.number().typeError('Price must be a number').positive().required(),
  description: yup.string().required('Description is required'),
  stock: yup.number().typeError('Stock must be a number').min(0).required(),
  rating: yup.number().typeError('Rating must be a number').min(0).max(5).required(),
  category: yup.string().required('Category is required')
})

const EditBook = () => {
  const { id } = useParams()
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<File | string>('')
  const dispatch = useDispatch<AppDispatch>()


  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddBookType>({
    resolver: yupResolver(schema) as any,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
    alert('Token not found. Please login again.');
    return;
  }
    dispatch(getBook({token, id: id as string}))
    .unwrap()
    .then((data) => {
      setValue('title', data.title)
      setValue('authorname', data.authorname)
      setValue('price', data.price)
      setValue('description', data.description)
      setValue('stock', data.stock)
      setValue('rating', data.rating)
      setValue('category', data.category)
      if (data.image) {
      setSelectedImage(data.image)
      setPreviewUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.image}`)
     }
    })
    .catch((err) => console.error(err))
    // api
    //   .get(`/books/view/${id}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
  }, [id, setValue])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const onSubmit = (data: AddBookType) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('authorname', data.authorname)
    formData.append('price', data.price.toString())
    formData.append('description', data.description)
    formData.append('stock', data.stock ? data.stock.toString() : '0')
    formData.append('rating', String(data.rating))
    formData.append('category', data.category)

    if (selectedImage instanceof File) {
      formData.append('image', selectedImage)
    }

    const token = localStorage.getItem('token')  
    if (!token) return; 

    dispatch(editBook({ token, formData, id: id as string }))
      .unwrap()//  returns the actual result or throws error
      .then(() => {
        alert('Book updated successfully!');
        router.push(`/booklist/${id}`);
      })
      .catch((err) => {
        alert('failed to update')
        console.error('Update failed:', err);
      });
    // api
    //   .patch(`/books/update/${id}`, formData, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f4f9', py: 8, px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 640,
          mx: 'auto',
          p: 4,
          borderRadius: 3,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
          ✏️ Edit Book
        </Typography>

        {previewUrl && (
        <div className="relative w-full h-52 mb-4 rounded-md overflow-hidden">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
            style={{ borderRadius: '0.375rem' }} 
          />
        </div>
      )}


        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 3 }}
        >
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Title"
                variant="outlined"
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />

          <Controller
            name="authorname"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Author"
                variant="outlined"
                margin="normal"
                error={!!errors.authorname}
                helperText={errors.authorname?.message}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Price (₹)"
                type="number"
                variant="outlined"
                margin="normal"
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />

          <Controller
            name="stock"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Stock"
                type="number"
                variant="outlined"
                margin="normal"
                error={!!errors.stock}
                helperText={errors.stock?.message}
              />
            )}
          />

          <Controller
            name="rating"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Rating (0 to 5)"
                type="number"
                variant="outlined"
                margin="normal"
                error={!!errors.rating}
                helperText={errors.rating?.message}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Category"
                variant="outlined"
                margin="normal"
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                margin="normal"
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2, mb: 3 }}
            fullWidth
          >
            Edit Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ backgroundColor: '#1976d2', py: 1.2 }}
          >
            ✅ Update Book
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default EditBook
