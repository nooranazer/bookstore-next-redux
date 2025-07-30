'use client'

import api from '@/lib/api'
import { UserType } from '@/types/UserType'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const ViewProfile = () => {
  const [profile, setProfile] = useState<UserType | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      api
        .get('/user/viewprofile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setProfile(res.data.data)
        })
        .catch((err) => {
          alert('No user found')
          console.error('No user found:', err)
        })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      {profile ? (
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 text-white relative overflow-hidden transition-transform hover:scale-[1.01]">
        
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${profile.image}`}
                alt="Profile"
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>


        
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-wide">{profile.username}</h2>
            <p className="text-gray-300 mt-1">{profile.email}</p>
            <span className="inline-block mt-3 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-medium">
              {profile.role ?? 'N/A'}
            </span>
          </div>

          
          <div className="mt-6 flex justify-center">
            <Link href="/profile/editprofile">
              <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-300">
                Edit Profile
              </button>
            </Link>
          </div>

          {/* Glowing background circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        </div>
      ) : (
        <p className="text-white text-xl">Loading profile...</p>
      )}
    </div>
  )
}

export default ViewProfile
