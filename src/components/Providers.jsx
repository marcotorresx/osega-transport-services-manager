import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TicketsContext } from '../TicketsContext';

// STYLES
const useStyles = makeStyles({
    tableContainer: {
        margin: "30px 0px",
        width: "1000px"
    },
    table: {
        minWidth: 500
    },
    input: {
        margin: "0px 20px 0px 0px"
    }
});

// COMPONENT
export default function CustomPaginationActionsTable() {

    // VARIABLES
    const classes = useStyles()
    const {providers, providersLoaded, createProvider, deleteProvider} = React.useContext(TicketsContext)
    const [createSection, setCreateSection] = React.useState(false)
    const [providerName, setProviderName] = React.useState("")

    // CLICK HANDLER
    function clickHandler(){
        // Validation
        if (!providerName.trim() || providerName === ""){
            alert("El nombre del proveedor es inválido.")
            return
        }

        // Create provider
        createProvider(providerName)

        // Clean values
        setProviderName("")
        setCreateSection(false)
    }

    return (
        providersLoaded && 
        <>
        {/* CRATE PROVIDER */}
        <div className="new_provider_div">
            {!createSection && <Button variant="contained" color="primary" onClick={() => setCreateSection(true)}>Nuevo Proveedor</Button>}
            {createSection &&
                <>
                    <TextField id="outlined-basic" label="Nombre" variant="outlined"
                        value={providerName} onChange={(e) => setProviderName(e.target.value)} className={classes.input}/>
                    <Button variant="contained" color="primary" onClick={clickHandler}>Crear Proveedor</Button>
                </>
            }
        </div>

        {/* TABLE */}
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="custom pagination table">

                {/* BODY */}
                <TableBody>
                    <TableRow key="headers">
                        <TableCell component="th" scope="row">
                            <b>PROVEEDOR</b>
                        </TableCell>
                        <TableCell component="th" scope="row">
                            <b>ID</b>
                        </TableCell>
                        <TableCell align="left">
                            <b>BORRAR</b>
                        </TableCell>
                    </TableRow>

                    {providers.map( provider => (
                        <TableRow key={provider.id}>
                            <TableCell>
                                {provider?.data().Proveedor ? provider?.data().Proveedor : "No disponible"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 150 }}>
                                {provider?.id ? provider?.id : "No registrado"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 200 }}>
                                <p onClick={() => deleteProvider(provider?.id)} className="delete_prov">Borrar Proveedor</p>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
        </>
    );
}