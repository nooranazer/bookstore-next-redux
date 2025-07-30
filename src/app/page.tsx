// 'use client'
// import Link from 'next/link'

// const HomePage = () => {
//   return (
//     <main className="min-h-screen bg-white text-gray-800">
//       {/* Hero Banner */}
//       <section className="bg-yellow-100 py-20 px-6 text-center">
//         <h1 className="text-5xl font-bold mb-4 text-gray-900">
//           Welcome to <span className="text-yellow-600">BookHive</span>
//         </h1>
//         <p className="text-lg text-gray-700">
//           Your one-stop shop for amazing books 🐝📚
//         </p>
//         <Link href="/login">
//           <button className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition">
//             Browse Books
//           </button>
//         </Link>
//       </section>

//       {/* Carousel Section (Basic with flex - can upgrade to slider later) */}
//       {/* <section className="py-8 px-4 overflow-x-auto">
//         <div className="flex space-x-4 w-max">
//           {[1, 2, 3].map((img) => (
//             <img
//               key={img}
//               src={`/banners/banner${img}.png`}
//               alt={`Banner ${img}`}
//               className="h-64 w-[400px] object-cover rounded-xl shadow"
//             />
//           ))}
//         </div>
//       </section> */}

//       {/* Featured Books */}
//       <section className="py-12 px-6">
//         <h2 className="text-3xl font-semibold mb-8 text-center">Featured Books</h2>
//         <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
//           {[1, 2, 3, 4, 5].map((book) => (
//             <div
//             key={book}
//             className="border rounded-lg p-4 w-52 mx-auto shadow hover:shadow-lg transition"
//           >
//             <img
//             src={`/books/book${book}.png`}
//             alt={`Book ${book}`}
//             className="h-auto w-auto mx-auto object-contain mb-4"
//           />


//               {/* <h3 className="text-lg font-medium">Book Title {book}</h3>
//               <p className="text-sm text-gray-600">Author Name</p> */}
//               <Link href={'/register'}>
//               <button className="mt-4 text-yellow-600 text-center font-semibold">
//                 View Details
//               </button>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </section>
//     </main>
//   )
// }

// export default HomePage


'use client'
import Link from 'next/link'
import { useUser } from '@/app/context/userContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const HomePage = () => {
  const { user } = useUser()
  const router = useRouter()

  const handleBrowseClick = () => {
    if (user) {
      router.push('/booklist')
    } else {
      router.push('/login')
    }
  }

  const featuredBooks = [
    { title: 'Whispers of  digital forest', rating: 4.7, image: '/books/book1.png' },
    { title: 'It Ends With Us', rating: 4.5, image: '/books/book2.png' },
    { title: 'The Alchemist', rating: 4.2, image: '/books/book3.png' },
    { title: 'Stranger Things', rating: 4.4, image: '/books/book4.png' },
    { title: 'Naalukettu ', rating: 4.3, image: '/books/book5.png' },
  ]

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Banner */}
      <section className="bg-yellow-100 py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Welcome to <span className="text-yellow-600">BookHive</span>
        </h1>
        <p className="text-lg text-gray-700">
          Your one-stop shop for amazing books 🐝📚
        </p>
        <button
          onClick={handleBrowseClick}
          className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
        >
          Browse Books
        </button>
      </section>

      {/* Featured Books */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Featured Books
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto">
          {featuredBooks.map((book, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl p-4 shadow-md hover:shadow-xl transition flex flex-col items-center"
            >
             <div className="relative h-64 w-full mb-4 rounded overflow-hidden">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-contain"
              />
            </div>
              <h3 className="text-lg font-semibold text-center">{book.title}</h3>
              <p className="text-sm text-yellow-600 font-medium mb-2">⭐ {book.rating}</p>

              <Link href="/register">
                <button className="mt-auto text-yellow-600 font-semibold hover:underline">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage

