'use client'
import api from '@/lib/api'
import  { AddBookType } from '@/types/BookType'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useDispatch, UseDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { addBook } from '@/redux/slices/bookSlice'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  authorname: yup.string().required('Author name is required'),
  price: yup.number().required().positive().typeError('Price must be a number'),
  stock: yup.number().required().typeError("Must be a number").min(0),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  rating: yup
    .number()
    .min(0)
    .max(5)
    .typeError('Rating must be a number between 0 and 5')
    .required('Rating is required'),
  image: yup
  .mixed()
  .required('Image is required')
  .test('fileType', 'Only image files are allowed', (value) => {
    if (value instanceof File) {
      return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
    }
    return false
  })


})

const AddBook = () => {
  const router = useRouter()
  // const [book, setBook] = useState<AddBookType>({
  //   title: '',
  //   authorname: '',
  //   price: 0,
  //   stock: 0,
  //   image: '',
  //   description: '',
  //   rating: 0,
  //   category: ''
  // })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<AddBookType>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: '',
      authorname: '',
      price: 0,
      stock: null,
      description: '',
      rating: null,
      category: '',
      image: undefined
    }
  })

  const [previewUrl, setPreviewUrl] = useState<string>('')
  const isMobile = useMediaQuery('(max-width:768px)')
  const dispatch = useDispatch<AppDispatch>()

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   setBook({ ...book, [name]: name === 'price' ? Number(value) : value })
  // }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('image', file)
      // setBook({ ...book, image: file })
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleAddButton =  (data: AddBookType) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('authorname', data.authorname)
    formData.append('price', data.price.toString())
    formData.append('description', data.description)
    formData.append('stock', data.stock ? data.stock.toString() : '0')
    formData.append('category', data.category)
    formData.append('rating', data.rating ? data.rating.toString() : '0')

    if (data.image instanceof File) {
      formData.append('image', data.image)
    }

    const token = localStorage.getItem('token')

    if (token) {
      dispatch(addBook({ formData, token}))
       .then((res) => {
        alert('✅ Book Added Successfully!')
        reset()
        router.push('/booklist')
        setPreviewUrl('')
       })
       .catch(() => {
        alert('❌ Failed to add book. Please try again.')

       })
    }
  }
      // const res = await api.post('/books/add', formData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // })
    //   alert('✅ Book Added Successfully!')
    //   reset()
    //   router.push('/booklist')
    //   setPreviewUrl('')
    // } catch (err) {
    //   console.error('❌ Error adding book:', err)
    //   alert('Failed to add book. Please try again.')
    // }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/addbook.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          width: '100%',
          p: isMobile ? 2 : 4,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0)', // no white background
          backdropFilter: 'blur(3px)'
        }}
      >
        <Button
          variant="outlined"
          onClick={() => router.back()}
          sx={{
            mb: 2,
            color: '#fff',
            borderColor: '#ccc',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#fff',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          ⬅ Back
        </Button>

        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#fff' }}
        >
         Add New Book
        </Typography>

        {previewUrl && (
          <Image
          src={previewUrl}
          alt="Preview"
          width={500} // set a width
          height={200} // set a height
          className="w-full h-52 object-cover rounded-md mb-4"
          style={{ width: '100%', height: '208px', objectFit: 'cover' }}
        />
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(handleAddButton)}
          noValidate
          autoComplete="off"
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 3
          }}
        >
          {/* Left Side */}
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              sx={{ 
              '& fieldset': { borderColor: '#ddd' }, 
              '&:hover fieldset': { borderColor: '#fff' } 
            }}
              label="Title"
              variant="outlined"
              margin="normal"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
              FormHelperTextProps={{ style: { color: 'lightpink' } }}
            />
            <TextField
              fullWidth
              label="Author Name"
              variant="outlined"
              margin="normal"
              sx={{ 
              '& fieldset': { borderColor: '#ddd' }, 
              '&:hover fieldset': { borderColor: '#fff' } 
               }}
              {...register('authorname')}
              error={!!errors.authorname}
              helperText={errors.authorname?.message}
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
              FormHelperTextProps={{ style: { color: 'lightpink' } }}
            />
            <TextField
              fullWidth
              label="Price"
              variant="outlined"
              margin="normal"
              type="number"
               sx={{ 
              '& fieldset': { borderColor: '#ddd' }, 
              '&:hover fieldset': { borderColor: '#fff' } 
               }}
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
              FormHelperTextProps={{ style: { color: 'lightpink' } }}
            />
            <TextField
              fullWidth
              label="Stock"
              variant="outlined"
              margin="normal"
               sx={{ 
              '& fieldset': { borderColor: '#ddd' }, 
              '&:hover fieldset': { borderColor: '#fff' } 
               }}
              type="number"
              {...register('stock')}
              error={!!errors.stock}
              helperText={errors.stock?.message}
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
              FormHelperTextProps={{ style: { color: 'lightpink' } }}
            />
            <TextField
              fullWidth
              label="Rating"
              variant="outlined"
              margin="normal"
              type="number"
               sx={{ 
              '& fieldset': { borderColor: '#ddd' }, 
              '&:hover fieldset': { borderColor: '#fff' } 
               }}
              {...register('rating')}
              error={!!errors.rating}
              helperText={errors.rating?.message}
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
              FormHelperTextProps={{ style: { color: 'lightpink' } }}
            />
          </Box>

          {/* Right Side */}
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              select
              variant="outlined"
              margin="normal"
              {...register('category')}
              error={!!errors.category}
              helperText={errors.category?.message}
              sx={{
                backgroundColor: '#222',
                color: '#fff',
                '& select': { color: '#fff' },
                '& fieldset': { borderColor: '#ddd' },
                '&:hover fieldset': { borderColor: '#fff' }
              }}
              InputLabelProps={{ style: { color: '#fff' } }}
              FormHelperTextProps={{ style: { color: 'lightpink' } }}
              SelectProps={{
                native: true
              }}
            >
              <option value="">Select Category</option>
              {[
                'Fiction',
                'Non-fiction',
                'Comics',
                'Education',
                'Biography',
                'Fantasy',
                'Science',
                'Other'
              ].map((option) => (
                <option key={option} value={option} style={{ backgroundColor: '#fff', color: '#000' }}>
                  {option}
                </option>
              ))}
            </TextField>


            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              margin="normal"
               sx={{ 
              '& fieldset': { borderColor: '#ddd' }, 
              '&:hover fieldset': { borderColor: '#fff' } 
               }}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
              FormHelperTextProps={{ style: { color: 'lightpink' } }}
              multiline
              rows={4}
            />

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 ,
              '& fieldset': { borderColor: '#ddd' }, 
              '&:hover fieldset': { borderColor: '#fff' } 
               }}
            >
              Upload Book Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {errors.image && (
              <Typography color="lightpink" fontSize="0.9rem">
                {errors.image.message}
              </Typography>
              
              
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: '#4a91d8ff',
                color: '#fff',
                py: 1.2,
                fontWeight: 'bold'
              }}
            >
              ➕ Add Book
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AddBook
