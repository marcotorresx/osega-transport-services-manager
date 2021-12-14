import './App.css';
import React from 'react';
import { Switch, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Register from "./components/Register"
import Login from "./components/Login"
import Graphs from "./components/Graphs"
import Details from "./components/Details"
import Table from "./components/Table"
import NoRole from "./components/NoRole"
import Home from "./components/Home"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
import Users from "./components/Users"
import { Container } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TicketsProvider from "./TicketsContext"
import InsertChartIcon from '@material-ui/icons/InsertChart';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EditIcon from '@material-ui/icons/Edit';
import EditTicket from "./components/EditTicket"
import GroupIcon from '@material-ui/icons/Group';
import EditUser from "./components/EditUser"
import Account from "./components/Account"
import PrivacyNotice from "./components/PrivacyNotice"
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Providers from "./components/Providers"
import EditAccount from "./components/EditAccount"
import dateFormat from "dateformat"

// STYLES
const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

// DATE FORMAL LABELS
dateFormat.i18n = {
  dayNames: [
    "Dom",
    "Lun",
    "Mar",
    "Mie",
    "Jue",
    "Vie",
    "Sab",
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  monthNames: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
};

// COMPONENT
function App() {

  const classes = useStyles();

  return (
    <div className="App">

      <Switch>

        {/* PUBLIC ROUTES */}
        <Route path="/" exact component={Home}/>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        <Route path="/aviso-privacidad" component={PrivacyNotice}/>

        {/* PRIVATE ROUTES */}
        <Route path="/private">
          <PrivateRoute>
            <TicketsProvider>

              {/* NO USER ROLE */}
              <Route path="/private/norole">
                <Navbar Icon={AccountCircleIcon} title="Rol No Asignado" accountButton signOutButton/>
                <Container className={classes.container}>
                  <NoRole/>
                </Container>
              </Route>

              {/* TABLES */}
              <Route path="/private/table">
                <Navbar Icon={DashboardIcon} title="Tablero" accountButton signOutButton/>
                <Container className={classes.container}>
                  <Table/>
                </Container>
              </Route>

              {/* DETAILS */}
              <Route path="/private/details/:id">
                <Navbar Icon={DashboardIcon} title="Tablero" accountButton signOutButton/>
                <Container className={classes.container}>
                  <Details/>
                </Container>
              </Route>

              {/* ACCOUNT */}
              <Route path="/private/account">
                <Navbar Icon={AccountCircleIcon} title="Mi Cuenta" signOutButton/>
                <Container className={classes.container}>
                  <Account/>
                </Container>
              </Route>

              {/* EDIT MY ACCOUNT */}
              <Route path="/private/editaccount">
                <Navbar Icon={AccountCircleIcon} title="Editar Mi Cuenta" signOutButton/>
                <Container className={classes.container}>
                  <EditAccount/>
                </Container>
              </Route>


              {/* ADMIN ROUTE */}
              <Route path="/private/admin">
                <AdminRoute>

                  {/* GRAPHS */}
                  <Route path="/private/admin/graphs">
                    <Navbar Icon={InsertChartIcon} title="Reportes" accountButton signOutButton/>
                    <Container className={classes.container}>
                      <Graphs/>
                    </Container>
                  </Route>

                  {/* USERS */}
                  <Route path="/private/admin/users">
                    <Navbar Icon={GroupIcon} title="Usuarios" accountButton signOutButton/>
                    <Container className={classes.container}>
                      <Users/>
                    </Container>
                  </Route>

                  {/* PROVIDERS */}
                  <Route path="/private/admin/providers">
                    <Navbar Icon={LocalShippingIcon} title="Proveedores" accountButton signOutButton/>
                    <Container className={classes.container}>
                      <Providers/>
                    </Container>
                  </Route>

                  {/* EDIT TICKET */}
                  <Route path="/private/admin/editticket/:id">
                  <Navbar Icon={EditIcon} title="Editar Registro" accountButton signOutButton/>
                    <Container className={classes.container}>
                      <EditTicket/>
                    </Container>
                  </Route>

                  {/* EDIT USER */}
                  <Route path="/private/admin/edituser/:uid">
                  <Navbar Icon={EditIcon} title="Editar Usuario" accountButton signOutButton/>
                    <Container className={classes.container}>
                      <EditUser/>
                    </Container>
                  </Route>

                </AdminRoute>
              </Route>


            </TicketsProvider>
          </PrivateRoute>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
