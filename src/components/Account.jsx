import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import {Link} from "react-router-dom"
import EmailIcon from '@material-ui/icons/Email';
import StorageIcon from '@material-ui/icons/Storage';
import { UserContext } from '../UserContext';
import Button from '@material-ui/core/Button';

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

    // VARIBLES
    const {userDB} = React.useContext(UserContext)
    const classes = useStyles()

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardcontent}>
                {/* TITULO */}
                <Typography variant="h6" component="h2" className={classes.title} align="center">
                    MI CUENTA
                </Typography>

                {/* FIELDS */}
                <div className="account_fields">
                    <div className="details_field">
                        <PersonIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Nombre: </b> {userDB?.name ? userDB?.name : "No disponible"}
                        </Typography>
                    </div>
                    <div className="details_field">
                        <EmailIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Correo: </b> {userDB?.email ? userDB?.email : "No disponible"}
                        </Typography>
                    </div>
                    <div className="details_field">
                        <StorageIcon />
                        <Typography variant="subtitle1" component="h2" gutterBottom>
                            <b>Tipo: </b> {userDB?.role ? userDB?.role : "No disponible"}
                        </Typography>
                    </div>
                </div>
                <Link to="/private/editaccount"><Button size="small" variant="outlined" color="secondary">Editar Mi Cuenta</Button></Link>
            </CardContent>
        </Card>
    );
}