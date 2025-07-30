'use client'

import { UserProvider } from "@/app/context/userContext"
import { store } from "@/redux/store"
import { Provider } from "react-redux"


const Providers = ({children} : {children : React.ReactNode}) => {
return(
    <Provider store={store}>
        <UserProvider>
            {children}
        </UserProvider>
    </Provider>
)}

export default Providers