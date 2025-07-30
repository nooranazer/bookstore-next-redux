// 'use client'
// import api from '@/lib/api'
// import BookType from '@/types/BookType'
// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'
// import { Pagination } from '@mui/material';

// const BookList = () => {
//   const [book, setBook] =useState<BookType[]>([])
//   const [ user, setUser ] = useState<{ role: string } | null>(null)
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);


//   useEffect(() => {
//   const storedUser = localStorage.getItem('user')
//   const token = localStorage.getItem('token');

//    if (storedUser) {
//       setUser(JSON.parse(storedUser))
//     }

//   // api.get('/books/list', {
//   api.get(`/books/list?page=${currentPage}&limit=3`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => {
//       console.log('Books fetched:', res.data);
//       setBook(res.data.data); 
//        setTotalPages(res.data.totalPages); 
//     })
//     .catch((err) => {
//       console.error('Book fetch failed:', err.response?.data);
//     });
// }, [currentPage]);

// const role = user?.role


//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//   <div className="max-w-6xl mx-auto">
//     <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
//     Find Your Favourite Book 📚
//    </h1>



//     {user?.role === 'seller' && (
//             <div className="flex justify-end mb-4">
//               <Link href="/booklist/addbook">
//                 <button className="bg-blue-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
//                   + Add Book
//                 </button>
//               </Link>
//             </div>

//           )}

//     {book.length === 0 ? (
//       <p className="text-center text-gray-500 text-lg">No books found</p>
//     ) : (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {book.map((b: any, index: number) => (
//           <div
//             key={index}
//             className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-5"
//           >
//              <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${b.image}`}alt={b.title} className="w-full h-auto object-cover rounded-lg mb-4" /> 

//             <h3 className="text-xl font-semibold text-center text-black mb-2">{b.title}</h3>
//             <p className="text-gray-800 mb-1">
//               <span className="font-medium">Author:</span> {b.authorname}
//             </p>
//             {/* {b.price && (
//               <p className="text-gray-600">
//                 <span className="font-medium">Price:</span> ₹{b.price}
//               </p>
//             )} */}
//             {b.rating && (
//               <p className="text-gray-600">
//                 <span className="font-medium">rating:</span> {b.rating}
//               </p>
//             )}

//             <Link href={`/booklist/${b._id}`}> 
//              <h3 className="text-m text-center text-black font-semibold"> view details</h3></Link>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
//   <Pagination
//   count={totalPages}
//   page={currentPage}
//   onChange={(event, value) => setCurrentPage(value)}
//   color="primary"
//   className="mt-8 flex justify-center"
// />
// </div>

//   )
// }

// export default BookList

'use client'
import api from '@/lib/api'
import BookType from '@/types/BookType'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Pagination } from '@mui/material'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { listBooks } from '@/redux/slices/bookSlice'

const BookList = () => {
  const [user, setUser] = useState<{ role: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const dispatch = useDispatch<AppDispatch>()
  const { books, loading, error, isRefresh, totalPages } = useSelector(
    (state: RootState) => state.books
  )

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (token) {
      dispatch(listBooks({ currentPage, token }))
    } else {
      console.warn('No token found — cannot fetch books.')
    }
  }, [currentPage])

  if (!books) {
    return <p>Loading book details...</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f4f9] to-[#e9eff5] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#333] mb-6 font-serif">
          Discover Your Next Favorite Book 📖
        </h1>
        <p className="text-center text-gray-500 text-lg mb-8">
          Curated reads just for you.
        </p>

        {user?.role === 'seller' && (
          <div className="flex justify-end mb-6">
            <Link href="/booklist/addbook">
              <button className="bg-[#3b82f6] hover:bg-[#f59e0b] text-white font-semibold py-2 px-5 rounded-full transition duration-300">
                + Add Book
              </button>
            </Link>
          </div>
        )}

        {books.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No books found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books
              .filter((b: BookType | null | undefined) => b !== null && b !== undefined)
              .map((b: BookType) => (
                <div key={b._id} className="bg-white rounded-xl shadow-md p-4 transition hover:shadow-lg">
                  {b.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${b.image}`}
                      alt={b.title}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-[300px] h-[200px] bg-gray-100 flex items-center justify-center rounded-lg mx-auto">
                      No Image
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-gray-800 text-center mt-4 mb-2 font-serif">
                    {b.title}
                  </h3>

                  <div className="grid grid-cols-3 items-center mt-2 mb-1 text-sm text-gray-700">
                    <p className="font-medium flex items-center gap-1 justify-start">
                      ✍️ {b.authorname}
                    </p>
                    <span className="text-yellow-500 font-semibold flex items-center gap-1 justify-center">
                      ⭐ {b.rating}
                    </span>
                    <p className="font-semibold text-green-600 flex justify-end">
                      ₹{b.price}
                    </p>
                  </div>

                  <div className="mt-4 text-center">
                    <Link
                      href={`/booklist/${b._id}`}
                      className="text-blue-600 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
          />
        </div>
      </div>
    </div>
  )
}

export default BookList
