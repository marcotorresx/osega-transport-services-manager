import React from 'react'
import { db, auth } from "./firebase"
import {useHistory} from "react-router"

export const UserContext = React.createContext()

const UserProvider = ({ children }) => {

    // VARIABLES
    const [user, setUser] = React.useState(null)
    const [userDB, setUserDB] = React.useState(null)
    const [userLoaded, setUserLoaded] = React.useState(false)
    const history = useHistory()

    // CHECK USER - Check if there is an active user in the session
    function checkUser(){
        // Check session
        auth.onAuthStateChanged(async user => {
            // If there is a user
            if (user) {
                // Set user
                console.log("CHECK USER: User founded.")
                setUser(user)
                try{
                    // Get user data from DB and set it
                    const userDB = await db.collection("Usuarios Web").doc(user.uid).get()
                    setUserDB(userDB.data())
                    setUserLoaded(true)
                }
                catch(error){
                    console.log("CHECK USER DB ERROR:", error)
                    alert("Hubo un error con el inicio de tu cuenta, espera a que la sesión se cierre en el sistema y vuelve a ingresar.")
                }
            }
            // If there is no user
            else {
                // Set values to null
                console.log("CHECK USER: User not founded.")
                setUser(null)
                setUserDB(null)
                setUserLoaded(true)
            }
        })
    }

    // REGISTER - Add a new user to auth and DB
    async function register(name, email, password){
        try{
            // Create user in Auth
            const user = await auth.createUserWithEmailAndPassword(email, password)
            setUser(user.user)

            // Create user in DB
            const dbUser = {
                name: name,
                email: email,
                uid: user.user.uid,
                role: "No Asignado"
            }

            // Add user in DB
            await db.collection("Usuarios Web").doc(user.user.uid).set(dbUser)
            setUserDB(dbUser)
        }
        catch(error){
            console.log("REGISTER ERROR:", error)
            return error
        }
    }

    // LOGIN - Login to an auth account and download the user data from DB
    async function login(email, password){
        try{
            // Search user in Auth
            const user = await auth.signInWithEmailAndPassword(email, password)
            setUser(user.user)

            // Search user in DB
            var dbUser = await db.collection("Usuarios Web").doc(user.user.uid).get()

            // If the userDB doesnt exists
            if (!dbUser.exists){
                console.log("LOGIN: User DB not founded.")

                // Create a new userDB doc and add it to the DB
                const dbUser = {
                    name: "No registrado",
                    email: user.user.email,
                    uid: user.user.uid,
                    role: "Usuario"
                }
                await db.collection("Usuarios Web").doc(user.user.uid).set(dbUser)
                setUserDB(dbUser)
            }

            // If the userDB exists
            else {
                console.log("LOGIN: User DB founded.")
                setUserDB(dbUser.data())
            }
        }
        catch(error){
            console.log("LOGIN ERROR:", error)
            return error
        }
    }

    // SIGN OUT - Close auth session
    function signOut(){
        console.log("USER SIGN OUT.")
        auth.signOut()
        setUser(null)
        setUserDB(null)
        history.push("/login")
    }

    // UPDATE MY ACCOUNT - Update values of the user DB doc
    async function updateMyAccount(name, email){
        try{
            // Update email from Auth
            await auth.currentUser.updateEmail(email)
            // Update name and email from DB
            await db.collection("Usuarios Web").doc(userDB.uid).update({name: name, email: email})
            // Change values in the Context
            setUserDB({...userDB, name, email})

            // Go to account
            history.push("/private/account")
        }
        catch(error){
            if (error.code === "auth/requires-recent-login"){
                alert("Para actualizar tu cuenta debes de haber ingresado al sistema recientemente, por favor cierra sesión y vuelve a ingresar.")
            }
            console.log("EDIT MY ACCOUNT ERROR", error)
        }
    }

    // ADMIN UPDATE USER - Change the role of a user
    async function updateUser(uid, role){
        // Check if the user making the update is admin
        if (userDB.uid === user.uid && userDB.role === "Admin"){
            try{
                // Update role
                await db.collection("Usuarios Web").doc(uid).update({role: role})

                // Go to users
                history.push("/private/admin/users")
            }
            catch(error){
                console.log(error)
            }
        }
        // If the user making the update isn´t admin
        else alert("Solo usuarios administradores pueden cambiar el tipo de usuario.")
    }

    // USE EFFECT - Execute this function after rendering
    React.useEffect(() => {
        checkUser()
    }, [])

    return (
        userLoaded &&
        <UserContext.Provider 
        value={{ 
            user, 
            userLoaded, 
            login, 
            register, 
            userDB, 
            signOut, 
            updateUser, 
            updateMyAccount 
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
