import React from 'react'
import { UserContext } from "../UserContext"
import { Redirect } from "react-router-dom"

const Home = () => {

    const {user, userDB} = React.useContext(UserContext)

    if (!user || !userDB) return <Redirect to="/login"/>
    else return <Redirect to="/private/table"/>
    
}

export default Home
