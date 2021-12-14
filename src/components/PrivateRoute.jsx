import React from 'react'
import { UserContext } from "../UserContext"
import { Redirect } from "react-router-dom"
import {useHistory} from "react-router"

const PrivateRoute = ({children}) => {

    const {user, userDB} = React.useContext(UserContext)
    const history = useHistory()

    // If there is no user
    if (!user || !userDB) return <Redirect to="/login"/>

    // If users role is no role
    else if (userDB?.role === "No Asignado") {
        history.push("/private/norole") // Go to no role
        return <>{children}</> // Return the routes
    }

    // If there is a valid user
    else return <>{children}</> // Return the routes
    
}

export default PrivateRoute
