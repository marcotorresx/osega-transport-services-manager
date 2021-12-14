import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import WorkIcon from '@material-ui/icons/Work';
import {Link, useParams} from "react-router-dom"
import {db, storage} from "../firebase"
import {UserContext} from "../UserContext"
import dateFormat from "dateformat"

// STYLES
const useStyles = makeStyles({
    card: {
        margin: "40px 0px",
        width: "400px",
        padding: "10px",
        position: "relative"
    },
    title: {
        margin: "0px 0px 25px 0px",
    },
    button: {
        margin: "15px 10px 0px 0px",
    }
});

// COMPONENT
export default function SimpleCard() {

    // VARIABLES
    const [ticket, setTicket] = React.useState({})
    const [loaded, setLoaded] = React.useState(false)
    const [imgUrl, setImgUrl] = React.useState(null)
    const {userDB} = React.useContext(UserContext)
    const {id} = useParams()
    const classes = useStyles()

    // USE EFFECT
    React.useEffect(() => {

         // GET TIKCET DATA
        async function getTicketData(){
            try{
                // Get ticket data
                const data = await db.collection("Registro").doc(id).get()
                setTicket(data.data())
                setLoaded(true)
                
                // Get ticket image url
                const imgRef = storage.ref(`imagenes/${data.data().Imagen}`)
                const url = await imgRef.getDownloadURL()
                setImgUrl(url)
            }
            catch(error){
                console.log("DETALIS ERROR:", error)
            }
        }

        getTicketData()

    }, [id])

    return (
        loaded && 
        <Card className={classes.card}>
            <Link className="detailsBackButton" to="/private/table">
                <ArrowBackIosIcon />
            </Link>
            <CardContent>
                {/* TITULO */}
                <Typography variant="h6" component="h2" className={classes.title} align="center">
                    DETALLES DE REGISTRO
                </Typography>
                <div className="details_field">
                    <PersonIcon />
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                        <b>Cliente: </b> {ticket?.Cliente ? ticket?.Cliente : "No disponible"}
                    </Typography>
                </div>
                <div className="details_field">
                    <DateRangeIcon />
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                        <b>Fecha: </b> {ticket?.Fecha ? dateFormat(new Date(ticket?.Fecha.toDate()), "fullDate") : "No disponible"}
                    </Typography>
                </div>
                <div className="details_field">
                    <WorkIcon />
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                        <b>Proveedor: </b> {ticket?.Proveedor ? ticket?.Proveedor : "No disponible"}
                    </Typography>
                </div>
                <div className="details_field">
                    <LocalShippingIcon />
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                        <b>Operador: </b> {ticket?.Operador ? ticket?.Operador : "No disponible"}
                    </Typography>
                </div>
                <div className="details_field">
                    <ViewAgendaIcon />
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                        <b>Placas: </b> {ticket?.Placas ? ticket?.Placas : "No disponible"}
                    </Typography>
                </div>
                <div className="details_field">
                    <EqualizerIcon />
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                        <b>Volumen: </b> {ticket?.Volumen ? ticket?.Volumen : "No disponible"}
                    </Typography>
                </div>
                <div className="details_field">
                    <LocationOnIcon />
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                        <b>Ubicación: </b> <p>{ticket?.Ubicacion ? `Lat: ${ticket?.Ubicacion?._lat}, Long: ${ticket?.Ubicacion?._long}` : "No disponible"}</p>
                    </Typography>
                </div>
                <div className="details_field">
                    <PersonIcon />
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                        <b>Comentarios: </b> {ticket?.Comentarios ? ticket?.Comentarios : "No disponible"}
                    </Typography>
                </div>

                {/* OPEN MAP */}
                <a href={`https://www.google.com/maps/search/?api=1&query=${ticket?.Ubicacion && ticket?.Ubicacion?._lat}%2C${ticket?.Ubicacion && ticket?.Ubicacion?._long}`} target="_blank" rel="noreferrer">
                    <Button color="secondary" variant="outlined" size="small" className={classes.button}>VER EN MAPA</Button>
                </a>

                {/* EDIT TICKET */}
                {userDB?.role === "Admin" && 
                <Link to={`/private/admin/editticket/${id}`}>
                    <Button color="secondary" variant="outlined" size="small" className={classes.button}>Editar Registro</Button>
                </Link>}

                <div className="detailsImgContainer">
                    <img src={imgUrl} alt="Imagen de Registro" className="detailsImg"/>
                </div>
            </CardContent>
        </Card>
    );
}