'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useUser } from '@/app/context/userContext'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LogIn, LogOut } from 'lucide-react'
import Image from 'next/image'


const Navbar = () => {
  const { user, setUser } = useUser()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {

    await fetch('/api/clear-cookie', {
      method: 'POST',
      credentials: 'include',
    })

    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  const pages = [
    { name: 'Home', href: '/booklist' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo + Pages */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
             <Image
              src="/favicon.png" 
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
              <Link href="/" className="text-xl font-bold">
                BookHive
              </Link>
            </div>

            {/* Pages only if logged in */}
            {user && (
              <div className="hidden md:flex gap-6 ml-4">
                {pages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    className="hover:text-yellow-400"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/profile">
                  <div className="h-8 w-8 relative">
                    <Image
                      src={
                        user.image
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.image}`
                          : '/avatar.png'
                      }
                      alt="avatar"
                      fill
                      className="rounded-full border-2 border-yellow-500 object-cover"
                    />
                  </div>
                </Link>
                <button
                onClick={handleLogout}
                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

              </>
            ) : (
              <Link
                href="/login"
                className="bg-yellow-500 hover:bg-yellow-400 px-4 py-1 rounded flex items-center gap-1"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>

            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {user && (
            <>
              {pages.map((page) => (
                <Link
                  key={page.name}
                  href={page.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:text-yellow-400"
                >
                  {page.name}
                </Link>
              ))}
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="block mt-2"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-left w-full mt-1 text-red-400 hover:text-red-500"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block mt-2"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
