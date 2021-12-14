import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Navbar from "./Navbar"
import {UserContext} from "../UserContext"
import Alert from '@material-ui/lab/Alert';
import PersonIcon from '@material-ui/icons/Person';
import ReCAPTCHA from "react-google-recaptcha";
import {useHistory} from "react-router"
import {Link} from "react-router-dom"

// STYLES
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "black",
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
      margin: "15px 0px 10px 0px"
  },
  link: {
      color: "#eea300"
  }
}));

// COMPONENT
export default function SignIn() {

    // VARIABLES
    const classes = useStyles()
    const {register} = React.useContext(UserContext)
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState(null)
    const [captchaValue, setCaptchaValue] = React.useState(null)
    const [disabledBtn, setDisabledBtn] = React.useState(true)
    const captcha = React.useRef(null)
    const history = useHistory()
    
    // SUBMIT HANDLER
    async function submitHandler(e){
        e.preventDefault()
        setDisabledBtn(false)
        
        // Validations
        if (!name.trim() || name === ""){
            setError("El nombre que ingresaste es inválido.")
            setDisabledBtn(true)
            return
        }
        if (!email.trim() || email === ""){
            setError("El correo que ingresaste es inválido.")
            setDisabledBtn(true)
            return
        }
        if (!password.trim() || password === ""){
            setError("La contraseña que ingresaste es inválida.")
            setDisabledBtn(true)
            return
        }
        if (captchaValue === null || captchaValue === undefined){
            setError("Necesitas comprobar que no eres un robot.")
            setDisabledBtn(true)
            return
        }
        setError(null)

        // Register
        const error = await register(name, email, password)
        if (error){
            setDisabledBtn(true)
            if (error.code === "auth/invalid-email") setError("El correo que ingresaste es invalido.")
            else if (error.code === "auth/email-already-in-use") setError("Ya hay una cuenta registrada con el correo que ingresaste.")
            else if (error.code === "auth/weak-password") setError("La contraseña debe tener mínimo 6 caracteres.")
            else setError(error.message)
        }
        else {
            // Set error null and go to table
            setError(null)
            history.push("/private/norole")
        }
    }

    return (
        <>
        {/* NAVBAR */}
        <Navbar Icon={PersonIcon} title="Registro" button="Ingresar" path="/login"/>

        {/* CONTAINER */}
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Registrarse
            </Typography>
            <form className={classes.form} onSubmit={submitHandler}>
            {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nombre"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                type="email"
                label="Correo Electrónico"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <div className="ReCAPTCHA">
                <ReCAPTCHA
                    ref={captcha}
                    sitekey="6Lc_GPUbAAAAAPXU8xTyGnjNCunrS2vkZveFZi-g"
                    onChange={() => setCaptchaValue(captcha.current.getValue())}
                    onExpired={() => setCaptchaValue(null)}
                />
            </div>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!disabledBtn}
            >
                Registrarse
            </Button>
            <Grid container>
                <Grid item>
                <Link to="/login">
                    <p className={classes.link}>¿Ya tienes cuenta? Ingresar</p>
                </Link>
                </Grid>
            </Grid>
            </form>
        </div>
        </Container>
        </>
    );
}