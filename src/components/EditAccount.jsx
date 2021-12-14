import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Link} from "react-router-dom"
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

export default function SimpleCard() {
    const {userDB, updateMyAccount} = React.useContext(UserContext)
    const [nameValue, setNameValue] = React.useState(userDB?.name)
    const [emailValue, setEmailValue] = React.useState(userDB?.email)
    const [btnEnabled, setBtnEnabled] = React.useState(true)
    const classes = useStyles()

    // CLICK HANDLER
    function clickHandler(){
        // Disable button
        setBtnEnabled(false)

        // Validations
        if (!nameValue.trim() || nameValue === "" || !emailValue.trim() || emailValue === ""){
            alert("Los campos que ingresaste son inválidos, no pueden estar vacíos.")
            setBtnEnabled(true)
            return
        }

        // Update Account
        updateMyAccount(nameValue, emailValue)
        setBtnEnabled(true)
    }

    return (
        <Card className={classes.card}>

            {/* GO BACK BUTTON */}
            <Link className="detailsBackButton" to="/private/account">
                <ArrowBackIosIcon />
            </Link>

            <CardContent className={classes.cardcontent}>

                {/* TITULO */}
                <Typography variant="h6" component="h2" className={classes.title} align="center">
                    EDITAR MI CUENTA
                </Typography>

                {/* FIELDS */}
                <div className="account_fields">

                    {/* NAME */}
                    <div className="details_field">
                        <PersonIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Nombre: </b>
                        </Typography>
                        <input type="text" required className="editaccount_input" value={nameValue} onChange={e => setNameValue(e.target.value)}/>
                    </div>

                    {/* EMAIL */}
                    <div className="details_field">
                        <EmailIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Correo: </b>
                        </Typography>
                        <input type="text" required className="editaccount_input" value={emailValue} onChange={e => setEmailValue(e.target.value)}/>
                    </div>

                    {/* TYPE */}
                    <div className="details_field">
                        <StorageIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Tipo: </b> {userDB?.role ? userDB?.role : "No disponible"}
                        </Typography>
                    </div>

                </div>
                <Button size="small" variant="contained" color="primary" disabled={!btnEnabled} onClick={clickHandler}>Guardar Cambios</Button>
            </CardContent>
        </Card>
    );
}