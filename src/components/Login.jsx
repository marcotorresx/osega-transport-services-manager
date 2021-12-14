import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Navbar from "./Navbar"
import {UserContext} from "../UserContext"
import PersonIcon from '@material-ui/icons/Person';
import {useHistory} from "react-router"
import {Link} from "react-router-dom"

// STYLES
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
export default function Login() {

    // VARIABLES
    const classes = useStyles()
    const {login} = React.useContext(UserContext)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState(null)
    const [disabledBtn, setDisabledBtn] = React.useState(true)
    const history = useHistory()

    // SUBMIT HANDLER
    async function submitHandler(e){
        e.preventDefault()
        setDisabledBtn(false)

        // Validations
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
        setError(null)

        // Log In
        const error = await login(email, password)
        if (error){
            setDisabledBtn(true)
            if (error.code === "auth/invalid-email") setError("El correo que ingresaste es invalido.")
            else if (error.code === "auth/wrong-password") setError("La contraseña que ingresaste es incorrecta.")
            else if (error.code === "auth/user-not-found") setError("No hay un usuario registrado con ese correo.")
            else setError(error.message)
        }
        else {
            // Set error null and go to table
            setError(null)
            history.push("/private/table")
        }
    }

  return (
    <>
    {/* NAVBAR */}
    <Navbar Icon={PersonIcon} title="Ingresar" button="Registro" path="/register"/>

    {/* CONTAINER */}
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ingresar
        </Typography>
        <form className={classes.form} onSubmit={submitHandler}>
          {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!disabledBtn}
          >
            Ingresar
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/register">
                    <p className={classes.link}>¿No tienes cuenta? Registrate</p>
                </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    </>
  );
}