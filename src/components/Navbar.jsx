import React from 'react'
import { AppBar, Toolbar, Typography, makeStyles, Button } from "@material-ui/core"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {Link} from "react-router-dom"
import {UserContext} from "../UserContext"

// STYLES
const useStyles = makeStyles({
    title: {
        margin: "2px 0px 0px 10px"
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between"
    },
    button: {
        margin: "0px 5px",
        color: "black"
    }
});

// COMPONENT
const Navbar = ({Icon, title, button, path, signOutButton, accountButton}) => {

    const classes = useStyles()
    const {userDB, signOut} = React.useContext(UserContext)

    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <div className="navbar_right">
                    <Icon />
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                </div>
                <div className="navbar_buttons">

                    {/* NORMAL BUTTONS */
                    userDB && userDB?.role !== "No Role" && 
                    <Link to="/private/table" className="navbar_link">
                        <Button color="inherit" className={classes.button}>TABLERO</Button>
                    </Link> }

                    {/* ADMIN BUTTONS */
                    userDB?.role === "Admin" && 
                    <>
                        <Link to="/private/admin/graphs" className="navbar_link">
                            <Button color="inherit" className={classes.button}>REPORTES</Button>
                        </Link>
                        <Link to="/private/admin/users" className="navbar_link">
                            <Button color="inherit" className={classes.button}>USUARIOS</Button>
                        </Link>
                        <Link to="/private/admin/providers" className="navbar_link">
                            <Button color="inherit" className={classes.button}>PROVEEDORES</Button>
                        </Link>
                    </> }

                    {/* OPTIONAL BUTTON */
                    button && 
                    <Link to={path} className="navbar_link">
                        <Button color="inherit" className={classes.button}>{button}</Button>
                    </Link> }

                    {/* SIGN OUT */
                    signOutButton && <Button color="inherit" className={classes.button} onClick={signOut}>CERRAR SESIÓN</Button> }

                    {/* MY ACCOUNT */
                    accountButton && 
                    <Link to="/private/account" className="navbar_link">
                        <AccountCircleIcon/>
                    </Link> }
                    
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
