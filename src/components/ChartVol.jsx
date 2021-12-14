import React from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import {db} from "../firebase"
import Typography from '@material-ui/core/Typography';
import {TicketsContext} from "../TicketsContext"

// STYLES
const useStyles = makeStyles({
    formControl: {
        minWidth: 120,
        margin: "10px 10px 0px 0px"
    }
})
const COLORS = [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)'
    ]
const timings = {
    last7days: "last 7 days",
    lastmonth: "last month",
    lastyear: "last year"
}
const volumes = [2500, 5000, 8000, 10000]

// PIE LABELS
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  const radius = outerRadius + 35
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) return null
  else {
      return (
        <text style={{fontFamily: "Roboto, sans-serif", fontSize: "14px"}} fill="black" x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${name} - ${(percent * 100).toFixed(0)}%`}
        </text>
      )
  }
}

// CHART
const Chart = () => {

    // VARIABLES
    const {providers, providersLoaded} = React.useContext(TicketsContext)
    const classes = useStyles()
    const [loaded, setLoaded] = React.useState(false)
    const [timing, setTiming] = React.useState(timings.last7days)
    const [providerSelected, setProviderSelected] = React.useState("")
    const [data, setData] = React.useState([])
    const [emptyState, setEmptyState] = React.useState(true)

    // CREATE DATA
    async function createData(selection, tomorrow){
        // Unable render
        setLoaded(false)

        try{
            const data = [] // Process the data        
            var isEmpty = true // Flag of no registers

            // Get all tickets where provider is the selected one and are in dates range
            var dataDB = await db.collection("Registro")
                .where("Proveedor", "==", providerSelected)
                .where("Fecha", ">=", selection)
                .where("Fecha", "<", tomorrow)
                .get()
            dataDB = dataDB.docs.map(doc => doc.data())

            // For each volumes
            volumes.forEach( volume => {
                var counter = 0 // Counter of registers

                // For each register
                dataDB.forEach( doc => {
                    if (doc?.Volumen === volume) {
                        counter++ // Increase counter
                        isEmpty = false // Indicate there is not empty
                    }
                })

                // Make value object
                const value = {
                    volume: `${volume} M³/L`,
                    Registros: counter
                }
                data.push(value)
            })

            setData(data) // Set data
            setTimeout(() => {
                setLoaded(true) // Let render
                setEmptyState(isEmpty) // Set empty state
            }, 1000)
        }
        catch(error){
            console.log("CHARTS ERROR:", error)
        }       
    }

    // USE EFFECT
    React.useEffect(() => {

        // GET TICKETS
        async function getTickets(){
            // Create dates
            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth()
            const day = now.getDate()
            const tomorrow = new Date (year, month, day + 1)
            var selection

            switch(timing){
                case timings.last7days: selection = new Date (year, month, day - 6); break;
                case timings.lastmonth: selection = new Date (year, month - 1, day); break;
                case timings.lastyear: selection = new Date (year - 1, month, day); break;
                default: selection = new Date (year, month, day - 6); break;
            }

            createData(selection, tomorrow)
        }

        if (providersLoaded && providerSelected !== "") getTickets()

    }, [timing, providersLoaded, providerSelected])

    return (
        <div className="chart" style={{paddingLeft: "30px", paddingBottom: "20px"}}>
            {/* TOP */}
            <div className="chart_top" style={{marginBottom: "0px", flexDirection: "column"}}>
                {/* TITLE */}
                <Typography variant="h6" style={{marginLeft: "-30px", color: "#f0a400", fontSize: "20px"}}>REGISTROS POR PROVEEDOR Y VOLUMEN</Typography>

                <div className="chartvol_selects_container">

                {/* INPUT PROVEEDOR */}
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-proveedor-native-simple">Proveedor</InputLabel>
                    <Select native label="Proveedor"
                        value={providerSelected}
                        onChange={(e) => setProviderSelected(e.target.value)}
                        inputProps={{
                            name: 'proveedor',
                            id: 'outlined-proveedor-native-simple',
                        }}
                    >
                        <option aria-label="None" value="" />
                        { providers.map( provider => (
                            <option value={provider.data().Proveedor} key={provider.id}>{provider.data().Proveedor}</option>
                        ))}
                    </Select>
                </FormControl>

                {/* INPUT PERIODO */}
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-periodo-native-simple">Periodo</InputLabel>
                    <Select native label="Periodo" 
                        value={timing}
                        onChange={(e) => setTiming(e.target.value)}
                        inputProps={{
                            name: 'periodo',
                            id: 'outlined-periodo-native-simple',
                        }}
                    >
                        <option value={timings.last7days}>Últimos 7 días</option>
                        <option value={timings.lastmonth}>Últimos 30 días</option>
                        <option value={timings.lastyear}>Último año</option>
                    </Select>
                </FormControl>
                </div>
            </div>

            {/*GRAPH */
            (providerSelected !== "" && providersLoaded)  ?
            <>
                {// If data loaded
                loaded ? 
                <ResponsiveContainer width="100%" height={400}>

                    { // If it data is not empty
                    !emptyState ?
                    <PieChart width={730} height={250}>
                        <Pie 
                            data={data} 
                            dataKey="Registros" 
                            nameKey="volume" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={150} 
                            fill="#61d095" 
                            label={renderCustomizedLabel} 
                            labelLine={true}
                        >
                            { data.map( (entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip itemStyle={{fontFamily: "sans-serif", fontSize: "14px"}} labelStyle={{fontFamily: "sans-serif", fontSize: "14px"}}/>
                    </PieChart>

                    // No registers founded
                    : <div className="noRegisters_provider">
                        <p>No hay registros de este proveedor</p>
                    </div>}
                </ResponsiveContainer>

                // Loading
                : <div className="chart_loading" style={{height: "400px"}}>
                    <img src="/loading.gif" width="400" alt=""/>
                </div> }
            </>

            // Selecciona un proveedor
            : <div className="no_provider_selected">
                <p>Selecciona un proveedor</p>
            </div>    
            }
        </div>
    )
}

export default Chart
