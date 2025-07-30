type BookType = {
  title: string
  authorname: string
  price: number
  image?: string | File 
  rating: number
  category: string 
  description: string
   _id?: string  
  stock: number | null 
}

export default BookType;

 export type AddBookType = {
  title: string
  authorname: string
  price: number
  stock: number | null 
  rating: number | null
  category: string  
  image: string | File 
  description: string

}