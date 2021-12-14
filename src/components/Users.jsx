import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {db} from "../firebase"
import {Link} from "react-router-dom"

// STYLES
const useStyles = makeStyles({
    tableContainer: {
        margin: "50px 0px",
        width: "1000px"
    },
    table: {
        minWidth: 500
    },
});

// COMPONENT
export default function CustomPaginationActionsTable() {

    // VARIABLES
    const classes = useStyles();
    const [users, setUsers] = React.useState([])
    const [loaded, setLoaded] = React.useState(false)

    // USE EFFECT
    React.useEffect(() => {

        // GET USERS DATA
        async function getUsersData(){
            try{
                // Get all users in DB
                const usersData = await db.collection("Usuarios Web").orderBy("name", "asc").get()
                setUsers(usersData.docs)
                setLoaded(true)
            }
            catch(error){
                console.log("ERROR USERS:", error)
            }
        }

        getUsersData()

    }, [])

    return (
        loaded && 
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="custom pagination table">

                {/* BODY */}
                <TableBody>
                    <TableRow key="headers">
                        <TableCell component="th" scope="row">
                            <b>NOMBRE</b>
                        </TableCell>
                        <TableCell align="left">
                            <b>CORREO</b>
                        </TableCell>
                        <TableCell align="left">
                            <b>TIPO</b>
                        </TableCell>
                        <TableCell align="left">
                            <b>EDITAR</b>
                        </TableCell>
                    </TableRow>
                    {users.map( user => (
                        <TableRow key={user.id}>
                            <TableCell >
                                {user?.data().name ? user?.data().name : "No disponible"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 350 }}>
                                {user?.data().email ? user?.data().email : "No disponible"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 150 }}>
                                {user?.data().role ? user?.data().role : "No disponible"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 150 }}>
                                <Link to={`/private/admin/edituser/${user?.id}`}>Editar Usuario</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}