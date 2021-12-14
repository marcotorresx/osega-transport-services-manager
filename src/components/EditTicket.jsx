import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import WorkIcon from '@material-ui/icons/Work';
import {Link, useParams} from "react-router-dom"
import {db} from "../firebase"
import {TicketsContext} from "../TicketsContext"

// STYLES
const useStyles = makeStyles({
    card: {
        margin: "40px 0px",
        width: "450px",
        padding: "10px",
        position: "relative"
    },
    title: {
        margin: "0px 0px 10px 0px",
    },
    button: {
        margin: "25px 0px 0px 0px",
    },
    textfield: {
        margin: "0px 0px 5px 0px"
    },
    cardcontent: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    },
    select: {
        margin: "0px 0px 5px 0px"
    },
    label: {
        fontSize: "12px",
        margin: "3px 0px 0px 0px"
    }
});

// COMPONENT
export default function SimpleCard() {

    // VARIABLES
    const classes = useStyles()
    const {id} = useParams()
    const {updateTicket, providersLoaded, providers} = React.useContext(TicketsContext)
    const [loaded, setLoaded] = React.useState(false)
    const [changeImgState, setChangeImgState] = React.useState(false)
    const [imgSelected, setImgSelected] = React.useState(null)
    const [btnEnabled, setBtnEnabled] = React.useState(true)

    // VALUES
    const [cliente, setCliente] = React.useState("")
    const [proveedor, setProveedor] = React.useState("")
    const [operador, setOperador] = React.useState("")
    const [placas, setPlacas] = React.useState("")
    const [volumen, setVolumen] = React.useState("")
    const [comentarios, setComentarios] = React.useState("")
    const [imgName, setImgName] = React.useState("")

    // CLICK HANDLER
    function clickHandler(e){
        e.preventDefault()
        setBtnEnabled(false)

        // Validations
        if (cliente === "" || cliente === undefined){
            alert("El campo Cliente no puede estar vacío.")
            setBtnEnabled(true)
            return
        }
        if (proveedor === "" || proveedor === undefined){
            alert("El campo Proveedor no puede estar vacío.")
            setBtnEnabled(true)
            return
        }
        if (operador === "" || operador === undefined){
            alert("El campo Operador no puede estar vacío.")
            setBtnEnabled(true)
            return
        }
        if (placas === "" || placas === undefined){
            alert("El campo Placas no puede estar vacío.")
            setBtnEnabled(true)
            return
        }
        if (volumen === "" || volumen === undefined){
            alert("El campo Volumen no puede estar vacío.")
            setBtnEnabled(true)
            return
        }

        // Update ticket
        updateTicket(id, cliente, proveedor, operador, placas, volumen, comentarios, changeImgState, imgSelected, imgName)
        setBtnEnabled(true)
    }

    // USE EFFECT
    React.useEffect(() => {

        // GET TIKCET DATA
        async function getTicketData(){
            try{
                // Load ticket data
                var data = await db.collection("Registro").doc(id).get()
                data = data.data()

                // Load values on states
                data?.Cliente ? setCliente(data?.Cliente) : setCliente("")
                data?.Proveedor ? setProveedor(data?.Proveedor) : setProveedor("")
                data?.Operador ? setOperador(data?.Operador) : setOperador("")
                data?.Placas ? setPlacas(data?.Placas) : setPlacas("")
                data?.Volumen ? setVolumen(data?.Volumen) : setVolumen("")
                data?.Comentarios ? setComentarios(data?.Comentarios) : setComentarios("")  
                setImgName(data?.Imagen)
                setLoaded(true)
            }
            catch(error){
                console.log("DETALIS ERROR:", error)
            }
        }

        getTicketData()

    }, [id])

    return (
        ( loaded && providersLoaded ) && 
        <Card className={classes.card}>

            {/* GO BACK BUTTON */}
            <Link className="detailsBackButton" to={`/private/details/${id}`}>
                <ArrowBackIosIcon />
            </Link>

            <CardContent className={classes.cardcontent}>

                {/* TITULO */}
                <Typography variant="h6" component="h2" className={classes.title} align="center">
                    EDITAR REGISTRO
                </Typography>

                {/* FIELDS */}
                <div className="edit_ticket_div">

                    {/* LABELS */}
                    <div className="edit_ticket_right">
                        <div className="details_field">
                            <PersonIcon />
                            <Typography variant="subtitle1" component="h2" gutterBottom>
                                <b>Cliente</b>
                            </Typography>
                        </div>
                        <div className="details_field">
                            <WorkIcon />
                            <Typography variant="subtitle1" component="h2" gutterBottom>
                                <b>Proveedor</b>
                            </Typography>
                        </div>
                        <div className="details_field">
                            <LocalShippingIcon />
                            <Typography variant="subtitle1" component="h2" gutterBottom>
                                <b>Operador</b>
                            </Typography>
                        </div>
                        <div className="details_field">
                            <ViewAgendaIcon />
                            <Typography variant="subtitle1" component="h2" gutterBottom>
                                <b>Placas</b>
                            </Typography>
                        </div>
                        <div className="details_field">
                            <EqualizerIcon />
                            <Typography variant="subtitle1" component="h2" gutterBottom>
                                <b>Volumen</b>
                            </Typography>
                        </div>
                        <div className="details_field">
                            <PersonIcon />
                            <Typography variant="subtitle1" component="h2" gutterBottom>
                                <b>Comentarios</b>
                            </Typography>
                        </div>
                    </div>

                    {/* INPUTS */}
                    <div className="edit_ticket_left">

                        {/* CLIENTE */}
                        <TextField className={classes.textfield} id="standard-basic" label="Cliente" 
                            value={cliente} onChange={e => setCliente(e.target.value)} required/>

                        {/* PROVEEDOR */}
                        <InputLabel htmlFor="provider" className={classes.label}>Proveedor</InputLabel>
                        <Select native label="proveedor" value={proveedor} onChange={(e) => setProveedor(e.target.value)} inputProps={{name: 'Campo', id: 'provider'}} className={classes.select} required>
                            {providers.map( provider => (
                                <option value={provider?.data().Proveedor} key={provider.id}>{provider?.data().Proveedor}</option>
                            ))}
                        </Select>

                        {/* OPERADOR */}
                        <TextField className={classes.textfield} id="standard-basic" label="Operador" 
                            value={operador} onChange={e => setOperador(e.target.value)} required/>

                        {/* PLACAS */}
                        <TextField className={classes.textfield} id="standard-basic" label="Placas" 
                            value={placas} onChange={e => setPlacas(e.target.value)} required/>

                        {/* VOLUMEN */}
                        <InputLabel htmlFor="volumen" className={classes.label}>Volumen</InputLabel>
                        <Select native label="Volumen" value={volumen} onChange={(e) => setVolumen(e.target.value)} inputProps={{name: 'Campo', id: 'volumen'}} className={classes.select} required>
                            <option value={2500}>2500</option>
                            <option value={5000}>5000</option>
                            <option value={8000}>8000</option>
                            <option value={10000}>10000</option>
                        </Select>

                        {/* COMENTARIOS */}
                        <TextField className={classes.textfield} id="standard-basic" label="Comentarios" 
                            value={comentarios} onChange={e => setComentarios(e.target.value)}/>

                    </div>
                </div>

                {/* CHANGE IMAGE */}
                <div className="change_img">

                    {/* SWITCH */}
                    <FormControlLabel
                        control={<Switch checked={changeImgState} onChange={e => setChangeImgState(e.target.checked)} color="primary"/>}
                        label="Cambiar Imagen"
                    />

                    {/* INPUT FILE */
                    changeImgState && 
                    <input 
                        type="file" 
                        className="change_img_input"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => setImgSelected(e.target.files[0])}
                    /> }

                </div>

                {/* BUTTON */}
                <Button variant="contained" color="primary" disabled={!btnEnabled} className={classes.button} onClick={clickHandler}>Guardar Cambios</Button>

            </CardContent>
        </Card>
    );
}

