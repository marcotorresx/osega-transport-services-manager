import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import InputLabel from '@material-ui/core/InputLabel';
import ExcelPopup from './ExcelPopup';
import {TicketsContext} from "../TicketsContext"

// STYLES
const useStyles = makeStyles({
    formControl: {
        width: "160px",
        margin: "0px 35px 0px 0px"
    },
    input: {
        margin: "0px 35px 0px 0px",
        width: "160px"
    },
    btnfilter: {
        marginRight: "40px"
    },
    advancedDates : {
        width: "150px",
        margin: "0px 25px 0px 0px"
    },
    advancedSelect: {
        width: "140px",
        margin: "0px 25px 0px 0px"
    },
    advancedInput: {
        width: "140px",
        margin: "0px 25px 0px 0px"
    }
});

const option = {
    Cliente: "Cliente",
    Fecha: "Fecha",
    Proveedor: "Proveedor",
    Operador: "Operador",
    Placas: "Placas",
    Volumen: "Volumen"
}

// COMPONENT
export default function SimpleCard() {
  
  // VARIABLES
  const classes = useStyles()
  const {basicFilterData, advancedFilterData, providers, providersLoaded, getAllData, showExcelPopup, setShowExcelPopup} = React.useContext(TicketsContext)
  const [field, setField] = React.useState("")
  const [value, setValue] = React.useState("")
  const [basicFilter, setBasicFilter] = React.useState("basic")

  // ADVANCED FILTER STATES
  const [fechaInicialADV, setFechaInicialADV] = React.useState("")
  const [fechaFinalADV, setFechaFinalADV] = React.useState("")
  const [proveedorADV, setProveedorADV] = React.useState("")
  const [clienteADV, setClienteADV] = React.useState("")
  const [operadorADV, setOperadorADV] = React.useState("")
  const [volumenADV, setVolumenADV] = React.useState("")

  // BASIC FILTER CLICK HANDLER
  function basicFiterClick(){
    // Validations
    if (!field.trim() || !value.trim() || field === "" || value === "") {
        alert("El campo o valor de la filtración es inválido.")
        return
    }

    // If field is volume make it integer
    if (field === option.Volumen){
        const volume = parseInt(value)
        basicFilterData(field, volume)
        setValue("")
        return
    }

    // If field is date make it Date
    if (field === option.Fecha){
        const date = new Date(value.replaceAll('-', ','))
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + 1)
        basicFilterData(field, date, nextDate)
        setValue("")
        return
    }

    // Other types of filtrations
    basicFilterData(field, value)
    setValue("")
  }

  // ADVANCED FILTER CLICK HANDLER
  function advancedFiterClick(){
    // Validations
    if (!fechaInicialADV.trim() || !fechaFinalADV.trim() || fechaInicialADV === "" || fechaFinalADV === ""){
        alert("Para hacer una filtración avanzada debes ingresar un rango de fechas.")
        return
    }

    // Advanced Filter
    advancedFilterData(fechaInicialADV, fechaFinalADV, proveedorADV, clienteADV, operadorADV, volumenADV)

    // Clean values
    setFechaInicialADV("")
    setFechaFinalADV("")
    setProveedorADV("")
    setClienteADV("")
    setOperadorADV("")
    setVolumenADV("")
  }

  return (
        <div className="filter">

            {/* EXCEL POPUP */
            showExcelPopup && <ExcelPopup/>}

            <Typography variant="h6" component="h2" gutterBottom style={{marginBottom: "20px"}}>Filtrar</Typography>

            {/* BASIC OR ADVANCED */}
            <RadioGroup aria-label="Tipo" name="Tipo" onChange={e => setBasicFilter(e.target.value)} className="filter_basic_advanced" 
                value={basicFilter}>
                <Button variant="outlined" size="small" color="secondary" className={classes.btnfilter} onClick={getAllData}>Cargar Todos</Button>
                <FormControlLabel value="basic" control={<Radio color="primary"/>} label="Basica" className="radio_filter"/>
                <FormControlLabel value="advanced" control={<Radio color="primary"/>} label="Avanzada" className="radio_filter"/>
                <div className="filter_excel_btn">
                    <Button variant="outlined" size="small" color="secondary" className={classes.btnfilter} 
                        onClick={() => setShowExcelPopup(true)}>Descargar en Excel</Button>
                </div>
            </RadioGroup>

            {/* ADVANCED FILTER */
            ( basicFilter === "advanced" && providersLoaded ) && 
            <div className="advanced_filter">

                {/* INPUT */}
                <TextField label="Fecha Inicial" type="date" className={classes.advancedDates}
                    value={fechaInicialADV}
                    onChange={(e) => setFechaInicialADV(e.target.value)}
                    InputLabelProps={{
                    shrink: true,
                    }} />
                <TextField label="Fecha Final" type="date" className={classes.advancedDates}
                    value={fechaFinalADV}
                    onChange={(e) => setFechaFinalADV(e.target.value)}
                    InputLabelProps={{
                    shrink: true,
                    }} />
                <FormControl variant="outlined" className={classes.advancedSelect}>
                    <InputLabel htmlFor="outlined-campo-native-simple">Proveedor</InputLabel>
                    <Select native label="Proveedor"
                        value={proveedorADV}
                        onChange={(e) => setProveedorADV(e.target.value)}
                        inputProps={{
                            name: 'Proveedor',
                            id: 'outlined-campo-native-simple',
                        }}
                    >
                        <option aria-label="None" value=""/>
                        {providers.map( provider => (
                            <option value={provider?.data().Proveedor} key={provider?.id}>{provider?.data().Proveedor}</option>
                        ))}
                    </Select>
                </FormControl>
                <TextField label="Cliente" variant="outlined" className={classes.advancedInput}
                    value={clienteADV} onChange={(e) => setClienteADV(e.target.value)}/>
                <TextField label="Operador" variant="outlined" className={classes.advancedInput}
                    value={operadorADV} onChange={(e) => setOperadorADV(e.target.value)}/>
                <TextField label="Volumen" variant="outlined" className={classes.advancedInput} type="number"
                    value={volumenADV} onChange={(e) => setVolumenADV(e.target.value)}/>

                {/* BUTTON */}
                <Button variant="contained" color="primary" onClick={advancedFiterClick}>Buscar</Button>
            </div> }

            {/* BASIC FILTER */
            ( basicFilter === "basic" && providersLoaded ) && 
            <div className="basic_filter">

                {/* OPTIONS */}
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-campo-native-simple">Campo</InputLabel>
                    <Select native label="Campo"
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                        inputProps={{
                            name: 'Campo',
                            id: 'outlined-campo-native-simple',
                        }}
                    >
                        <option aria-label="None" value=""/>
                        <option value={option.Cliente}>Cliente</option>
                        <option value={option.Fecha}>Fecha</option>
                        <option value={option.Proveedor}>Proveedor</option>
                        <option value={option.Operador}>Operador</option>
                        <option value={option.Placas}>Placas</option>
                        <option value={option.Volumen}>Volumen</option>
                    </Select>
                </FormControl>

                {/* INPUT DATE */
                field === option.Fecha && <TextField
                    id="date"
                    label="Fecha"
                    type="date"
                    className={classes.input}
                    onChange={(e) => setValue(e.target.value)}
                    InputLabelProps={{
                    shrink: true,
                    }}
                /> }

                {/* INPUT PROVEEDOR */
                field === option.Proveedor && <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="basic-provider">Proveedor</InputLabel>
                    <Select native label="Proveedor" 
                        onChange={(e) => setValue(e.target.value)}
                        inputProps={{
                            name: 'Proveedor',
                            id: 'basic-provider',
                        }}
                    >
                        <option aria-label="None" value=""/>
                        {providers.map(provider => (
                            <option value={provider?.data().Proveedor} key={provider?.id}>{provider?.data().Proveedor}</option>
                        ))}
                    </Select>
                </FormControl> }

                {/* INPUT TEXT */
                ( field !== option.Proveedor && field !== option.Fecha ) && 
                    <TextField id="outlined-basic" label="Valor" variant="outlined" className={classes.input}
                        value={value} onChange={(e) => setValue(e.target.value)}/> }

                {/* BUTTON */}
                <Button variant="contained" color="primary" onClick={basicFiterClick}>Buscar</Button>

            </div>}
        </div>
        
  );
}