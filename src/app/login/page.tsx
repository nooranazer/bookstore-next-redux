  'use client';

  import React from 'react';
  import api from '@/lib/api';
  import { useRouter } from 'next/navigation';
  import { useUser } from '../context/userContext';
  import * as yup from 'yup';
  import { useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';

  //  validation schema
  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  type LoginFormData = {
    email: string;
    password: string;
  };

  const LoginPage = () => {
    const router = useRouter();
    const { setUser } = useUser();

    //  Set up useForm
    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm<LoginFormData>({
      resolver: yupResolver(schema),
    });

  
//     const onSubmit = async (data: LoginFormData) => {
//       try {
//         const res = await api.post('/auth/', {
//           email: data.email,
//           password: data.password,
//         });

//         const { token, data: userData } = res.data;

//         if (token) {
//           localStorage.setItem('token', token);
//         }
//         if (userData) {
//           localStorage.setItem('user', JSON.stringify(userData));
//           setUser(userData);
//         }

//          console.log('Calling set-cookie...');
        
//         const cookieRes = await fetch('/api/set-cookie', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ token, role: userData.role }),
// });

// if (!cookieRes.ok) {
//   const errorMessage = await cookieRes.text(); // Read raw error safely
//   console.error('Cookie Error:', errorMessage);
//   throw new Error('Failed to set cookies');
// }

// const cookieJson = await cookieRes.json(); // Parse JSON only after success
// console.log('Cookie response:', cookieJson);


//    console.log('Redirecting to /booklist...');

//         router.push('/booklist');
//         alert('Welcome to BookHive!');
//       } catch (err) {
//         alert('Invalid credentials');
//       }
//     };

const onSubmit = (data: LoginFormData) => {
  api.post('/auth/', {
    email: data.email,
    password: data.password,
  })
    .then((res) => {
      const { token, data: userData } = res.data;
      console.log('Login API response:', res);

      if (!token || !userData) {
        alert('Login failed');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Set cookie using fetch
      return fetch('/api/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, role: userData.role }),
      }).then((cookieRes) => {
        if (!cookieRes.ok) {
          console.warn('Failed to set cookies');
        }

        alert('Login successful'); 
        router.push('/booklist');
      });
    })
    .catch((err) => {
      console.error('Login failed:', err);
      alert('Invalid credentials'); 
    });
};


    return (
      <div className="flex min-h-screen">
        <div className="hidden lg:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/login.png')" }} />

        <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-24">
          <h2 className="text-4xl font-bold text-white-800 mb-6">Welcome Back 📚</h2>
          <p className="text-sm text-gray-500 mb-10">Login to continue to BookHive</p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Password</label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Don’t have an account?{' '}
            <a href="/register" className="text-yellow-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    );
  };

  export default LoginPage;
