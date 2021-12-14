import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Link, useParams} from "react-router-dom"
import {db} from "../firebase"
import EmailIcon from '@material-ui/icons/Email';
import StorageIcon from '@material-ui/icons/Storage';
import { UserContext } from '../UserContext';

// STYLES
const useStyles = makeStyles({
    card: {
        margin: "40px 0px",
        width: "550px",
        padding: "10px",
        position: "relative"
    },
    title: {
        margin: "0px 0px 25px 0px",
    },
    button: {
        margin: "30px 10px 0px 0px",
    },
    cardcontent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
});

// COMPONENT
export default function SimpleCard() {

    // VARIABLES
    const classes = useStyles()
    const {updateUser} = React.useContext(UserContext)
    const {uid} = useParams()
    const [user, setUser] = React.useState({})
    const [loaded, setLoaded] = React.useState(false)
    const [role, setRole] = React.useState("Usuario")

    // SAVE CHANGES
    function saveChanges(){
        // If role value is valid
        if (role === "Admin" || role === "Usuario"){
            // Update user
            updateUser(uid, role)
        }
        else alert("No se pudo actualizar el usuario porque los cambios son inválidos.")
    }

    // USE EFFECT
    React.useEffect(() => {

        // GET USER DATA
        async function getUserData(){
            try{
                const data = await db.collection("Usuarios Web").doc(uid).get()
                setUser(data.data())
                setRole(data.data().role)
                setLoaded(true)
            }
            catch(error){
                console.log("DETALIS ERROR:", error)
            }
        }

        getUserData()

    }, [uid])

    return (
        loaded && 
        <Card className={classes.card}>
            <Link className="detailsBackButton" to="/private/admin/users">
                <ArrowBackIosIcon />
            </Link>
            <CardContent className={classes.cardcontent}>
                {/* TITULO */}
                <Typography variant="h6" component="h2" className={classes.title} align="center">
                    EDITAR USUARIO
                </Typography>

                {/* FIELDS */}
                <div className="edituser_fields">
                    {/* NN */}
                    <div className="details_field">
                        <PersonIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Nombre: </b> {user?.name ? user?.name : "No disponible"}
                        </Typography>
                    </div>
                    <div className="details_field">
                        <EmailIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Correo: </b> {user?.email ? user?.email : "No disponible"}
                        </Typography>
                    </div>
                    <div className="details_field">
                        <StorageIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Tipo: </b>
                        </Typography>
                        <select className="edituser_select" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="No Asignado">No Asignado</option>
                            <option value="Proveedor">Proveedor</option>
                            <option value="Usuario">Usuario</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>

                {/* BUTTONS */}
                <Button color="primary" variant="contained" size="small" className={classes.button} onClick={saveChanges}>Guardar Cambios</Button>
            </CardContent>
        </Card>
    );
}