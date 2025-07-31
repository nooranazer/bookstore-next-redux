'use client'

import { UserProvider } from "@/app/context/userContext"
import { store } from "@/redux/store"
import { Provider } from "react-redux"
import { Toaster } from 'react-hot-toast';


const Providers = ({children} : {children : React.ReactNode}) => {
return(
    <Provider store={store}>
        <UserProvider>
         <Toaster position="top-right" reverseOrder={false} />
            {children}
        </UserProvider>
    </Provider>
)}

export default Providers