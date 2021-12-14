import React from 'react'
import { UserContext } from "../UserContext"
import { Redirect } from "react-router-dom"

const AdminRoute = ({children}) => {

    const {user, userDB} = React.useContext(UserContext)

    if (user?.uid === userDB?.uid && userDB?.role === "Admin") return <>{children}</>
    else {
        alert("Solo usuarios administradores pueden acceder a esta ruta.")
        return <Redirect to="/private/table"/>
    }
    
}

export default AdminRoute