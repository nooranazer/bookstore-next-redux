'use client';
import React, { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '../context/userContext';

//yup schema
const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters'),
  role: yup.string().required('Role is required'),
 image: yup
  .mixed()
  .required('Image is required')
  .test('fileType', 'Only image files are allowed', (value: any) => {
  const file = value instanceof File ? value : value?.[0];
  return (
    file &&
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  );
})


})



const RegisterPage = () => {
  const router = useRouter()
  const { setUser } = useUser();
  // const [ username, setUsername] = useState('')
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [role, setRole] = useState('');
  // const [image, setImage] = useState<File | null>(null);

  const { register, handleSubmit, setValue, formState: { errors }, } = useForm({
    resolver: yupResolver(schema),
  })

  
  const handleRegister = (data: any) => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('role', data.role);
  formData.append('image', data.image[0]);

  api.post('/auth/register', formData)
    .then((res) => {
      const { token, data: user } = res.data;

      if (token) {
        localStorage.setItem('token', token);
      }

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }

      // set cookie
      return fetch('/api/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, role: user.role }),
      });
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to set cookie');
      }
      return res.json();
    })
    .then(() => {
      router.push('/booklist');
    })
    .catch((err) => {
      console.error('Registration error:', err);
      alert(err?.response?.data?.message || err.message || 'Registration failed');
    });
};

  return (
    <div className="flex min-h-screen">
      {/* Left image side */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/login.png')" }}
      />

      {/* Right form side */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-24">
        <h2 className="text-4xl font-bold text-white-800 mb-6">Create Account ✨</h2>
        <p className="text-sm text-gray-500 mb-10">Join the BookHive community</p>

        <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
  <div>
    <label className="block mb-1 text-sm text-white-600">Name</label>
    <input
      type="text"
      {...register ('username')}
      //onChange={(e) => setUsername(e.target.value)}
      placeholder="Your name"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
    />
    {errors.username && <p className="text-red-500 text-sm mt-1">
      {errors.username.message}</p>}
  </div>

  <div>
    <label className="block mb-1 text-sm text-white-600">Email</label>
    <input
      type="email"
       {...register ('email')}
      // value={email}
      // onChange={(e) => setEmail(e.target.value)}
      placeholder="you@example.com"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
    />
    {errors.email && <p className="text-red-500 text-sm mt-1">
      {errors.email.message}</p>}
  </div>

  <div>
    <label className="block mb-1 text-sm text-white-900">Password</label>
    <input
      type="password"
      {...register ('password')}
      //onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
    />
   {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

  </div>

  <div>
    <label className="block mb-1 text-sm text-white-600">Profile Image</label>
    <input
      type="file"
      {...register('image')}
      accept="image/*"
      //onChange={(e) => setImage(e.target.files?.[0] || null)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
      // required
    />
    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
  </div>

  <div>
    <label className="block mb-1 text-sm text-white-600">Role</label>
    <select
      // value={role}
      // onChange={(e) => setRole(e.target.value)}
      {...register('role')}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
    >
      <option value="">Select Role</option>
      <option value="buyer">Buyer</option>
      <option value="seller">Seller</option>
    </select>
    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
  </div>

  <button
    type="submit"
    className="w-full py-3 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition duration-200"
  >
    Register
  </button>
</form>


        <p className="text-sm text-gray-500 mt-6">
          Already have an account? <a href="/login" className="text-yellow-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
