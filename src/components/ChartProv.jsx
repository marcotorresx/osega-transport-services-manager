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
        margin: "10px 0px 0px 0px"
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
    const classes = useStyles()
    const {providers, providersLoaded} = React.useContext(TicketsContext)
    const [timing, setTiming] = React.useState(timings.last7days)
    const [loaded, setLoaded] = React.useState(false)
    const [data, setData] = React.useState([])

    // CREATE DATA
    function createData(selection, tomorrow){
        // Unable render
        setLoaded(false)

        try{
            // Process the data
            const data = []

            // For each provider
            providers.forEach( async provider => {
                // Get the registers where is the actual provider and between dates
                const dataDB = await db.collection("Registro")
                    .where("Proveedor", "==", provider?.data().Proveedor)
                    .where("Fecha", ">=", selection)
                    .where("Fecha", "<", tomorrow)
                    .get()

                // Make value object
                const value = {
                    provider: provider?.data().Proveedor,
                    Registros: dataDB.size
                }
                data.push(value)
            })

            // Set data and let render
            setData(data)
            setTimeout(() => setLoaded(true), 1000)
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

        if (providersLoaded) getTickets()

    }, [timing, providersLoaded])

    return (
        <div className="chart" style={{paddingLeft: "30px", paddingBottom: "20px"}}>
            {/* TOP */}
            <div className="chart_top" style={{marginBottom: "0px"}}>
                {/* TITLE */}
                <Typography variant="h6" style={{marginLeft: "-30px", color: "#f0a400", fontSize: "20px"}}>REGISTROS POR PROVEEDOR</Typography>

                {/* INPUT */}
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

            {/*GRAPH */
            (loaded && providersLoaded) ? 

            <ResponsiveContainer width="100%" height={400}>
                <PieChart width={730} height={250}>
                    <Pie 
                        data={data} 
                        dataKey="Registros" 
                        nameKey="provider" 
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
                    <Tooltip 
                        itemStyle={{fontFamily: "sans-serif", fontSize: "14px"}} 
                        labelStyle={{fontFamily: "sans-serif", fontSize: "14px"}}
                    />
                </PieChart>
            </ResponsiveContainer>
             : 
            <div className="chart_loading" style={{height: "400px"}}>
                <img src="/loading.gif" width="400" alt=""/>
            </div> }
        </div>
    )
}

export default Chart
