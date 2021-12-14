import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TicketsContext } from "../TicketsContext"
import Filter from "../components/Filter"
import IconButton from '@material-ui/core/IconButton';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import dateFormat from "dateformat"
import {Link} from "react-router-dom"

// STYLES
const useStyles = makeStyles({
    tableContainer: {
        margin: "30px 0px"
    },
    table: {
        minWidth: 500
    },
    iconbutton: {
        marginRight: "10px"
    }
});

// COMPONENT
export default function CustomPaginationActionsTable() {
    
    // VARIABLES
    const classes = useStyles();
    const { tickets, ticketsLoaded, ticketsPreviousBtn, ticketsNextBtn, getAllNextData, getAllPreviousData } = React.useContext(TicketsContext)

    return (
        ticketsLoaded && 
        <>
            {/* FILTER */}
            <Filter/>

            {/* TABLE */}
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="custom pagination table">

                    {/* BODY */}
                    <TableBody>
                        <TableRow key="headers">
                            <TableCell component="th" scope="row">
                                <b>CLIENTE</b>
                            </TableCell>
                            <TableCell align="left">
                                <b>FECHA</b>
                            </TableCell>
                            <TableCell align="left">
                                <b>PROVEEDOR</b>
                            </TableCell>
                            <TableCell align="left">
                                <b>OPERADOR</b>
                            </TableCell>
                            <TableCell align="left">
                                <b>PLACAS</b>
                            </TableCell>
                            <TableCell align="left">
                                <b>VOLUMEN</b>
                            </TableCell>
                            <TableCell align="left">
                                <b>UBICACIÓN</b>
                            </TableCell>
                            <TableCell align="left">
                                <b>DETALLES</b>
                            </TableCell>
                        </TableRow>
                        {tickets.map( row => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row" style={{ width: 190 }}>
                                    {row?.data().Cliente ? row?.data().Cliente : "No disponible"}
                                </TableCell>
                                <TableCell align="left" style={{ width: 130 }}>
                                    {row?.data().Fecha ? dateFormat(new Date(row?.data().Fecha.toDate()), "mediumDate") : "No disponible"}
                                </TableCell>
                                <TableCell align="left" style={{ width: 150 }}>
                                    {row?.data().Proveedor ? row?.data().Proveedor : "No disponible"}
                                </TableCell>
                                <TableCell align="left" style={{ width: 180 }}>
                                    {row?.data().Operador ? row?.data().Operador : "No disponible"}
                                </TableCell>
                                <TableCell align="left" style={{ width: 150 }}>
                                    {row?.data().Placas ? row?.data().Placas : "No disponible"}
                                </TableCell>
                                <TableCell align="left" style={{ width: 130 }}>
                                    {row?.data().Volumen ? row?.data().Volumen : "No disponible"}
                                </TableCell>
                                <TableCell align="left">
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${row?.data().Ubicacion && row?.data().Ubicacion?._lat}%2C${row?.data().Ubicacion && row?.data().Ubicacion?._long}`} target="_blank" rel="noreferrer">Ver Ubicación</a>
                                </TableCell>
                                <TableCell align="left">
                                    <Link to={`/private/details/${row.id}`}>Ver Detalles</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* TABLE FOOTER */}
                <div className="table_footer">
                    <IconButton disabled={!ticketsPreviousBtn} className={classes.iconbutton} onClick={getAllPreviousData}><SkipPreviousIcon/></IconButton>
                    <IconButton disabled={!ticketsNextBtn} className={classes.iconbutton} onClick={getAllNextData}><SkipNextIcon/></IconButton>
                </div>
            </TableContainer>
        </>
    );
}