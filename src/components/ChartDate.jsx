import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import {db} from "../firebase"
import Typography from '@material-ui/core/Typography';
import dateFormat from "dateformat"

// STYLES
const useStyles = makeStyles({
    formControl: {
        minWidth: 120,
        margin: "10px 0px 0px 0px"
    }
})
const timings = {
    last7days: "last 7 days",
    lastmonth: "last month",
    lastyear: "last year"
}

// LABELS
const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()
const day = today.getDate()
const tomorrow = new Date(year, month, day + 1)

const last7days_labels = []
for (let i = 0; i < 7; i++){
    last7days_labels.push(new Date(year, month, day - i))
}

const lastmonth_labels = []
lastmonth_labels.push(tomorrow)
for (let i = 1; i < 5; i++){
    lastmonth_labels.push(new Date(year, month, day - (7 * i)))
}

const lastyear_labels = []
lastyear_labels.push(tomorrow)
for (let i = 0; i < 12; i++){
    lastyear_labels.push(new Date(year, month - i, 1))
}

// COMPONENT
const ChartDate = () => {

    // VARIABLES
    const classes = useStyles()
    const [loaded, setLoaded] = React.useState(false)
    const [timing, setTiming] = React.useState(timings.last7days)
    const [data, setData] = React.useState([])

    // CREATE DATA 7 DAYS
    async function createData7Days(labels){
        // Select the day where the week strarts
        const lastWeekBeginning = labels[labels.length - 1]

        // Unable render
        setLoaded(false)

        try{
            // Get last weeks tickets
            const dataDB = await db.collection("Registro")
                .where("Fecha", ">=", lastWeekBeginning)
                .where("Fecha", "<", tomorrow).get()
            const tickets = dataDB.docs.map(doc => doc.data())

            // Process the data
            var data = []

            // For each day
            for (let i = 0; i < labels.length; i++){
                // Counter of registers each day
                var counter = 0

                // For each ticket
                for (let j = 0; j < tickets.length; j++){
                    // If the number of day of the label is equal to the number of day of the register
                    if ( labels[i].getDate() === new Date( tickets[j]?.Fecha.toDate() ).getDate() ) counter++
                }

                // Create value object
                const value = {
                    date: dateFormat(labels[i], "dddd"),
                    Registros: counter
                }
                data.push(value)
            }

            // Reverse the data array to be in time order
            const reverseData = data.reverse()
            setData(reverseData)

            // Let render
            setLoaded(true)
        }
        catch(error){
            console.log("CHARTS ERROR:", error)
        }       
    }

    // CREATE DATA LAST MONTH 
    async function createDataMonth(lab){
        // Unable render
        setLoaded(false)

        // Reverse labels to be in time order
        const labels = lab.reverse()
        const data = []

        // For each week
        for (let i = 0; i < 4; i++){
            try{
                // Get the data using the labels limits
                const dataDB = await db.collection("Registro")
                    .where("Fecha", ">=", labels[i])
                    .where("Fecha", "<", labels[i + 1]).get()

                // Make value object
                var value = {
                    date:   dateFormat(labels[i], "d") + " " + 
                            dateFormat(labels[i], "mmm") + " - " + 
                            dateFormat(labels[i+1], "d") + " " + 
                            dateFormat(labels[i+1], "mmm"),
                    Registros: dataDB.size
                }
                data.push(value)
            }
            catch(error){
                console.log(error)
            }
        }

        // Set values
        setData(data)

        // Let render
        setLoaded(true)
    }

    // CREATE DATA LAST YEAR
    async function createDataYear(lab){
        // Unable render
        setLoaded(false)

        // Reverse labels to be in time order
        const labels = lab.reverse()
        const data = []

        // For each month
        for (let i = 0; i < labels.length; i++){
            try{
                // Get the data using the labels limits
                const dataDB = await db.collection("Registro")
                    .where("Fecha", ">=", labels[i])
                    .where("Fecha", "<", labels[i + 1]).get()

                // Make value object
                var value = {
                    date: dateFormat(labels[i], "mmm"),
                    Registros: dataDB.size
                }
                data.push(value)
            }
            catch(error){
                console.log(error)
            }
        }

        // Set values
        setData(data)

        // Let render
        setLoaded(true)
    }

    // USE EFFECT
    React.useEffect(() => {

        // GET TICKETS
        async function getTickets(){
            switch(timing){
                case timings.last7days: createData7Days(last7days_labels); break;
                case timings.lastmonth: createDataMonth(lastmonth_labels); break;
                case timings.lastyear: createDataYear(lastyear_labels); break;
                default: createData7Days(last7days_labels); break;
            }
        }

        getTickets()

    }, [timing])

    return (
        <div className="chart">
            {/* TOP */}
            <div className="chart_top">

                {/* TITLE */}
                <Typography variant="h6" style={{color: "#f0a400"}}>VOLUMEN DE REGISTROS POR FECHA</Typography>

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
            loaded ? 
            <ResponsiveContainer width="100%" height={300}>
            <BarChart width="100%" height="100%" data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{fontFamily: "sans-serif", fontSize: "14px"}}/>
              <YAxis style={{fontFamily: "sans-serif", fontSize: "14px"}}/>
              <Tooltip itemStyle={{fontFamily: "sans-serif", fontSize: "14px"}} labelStyle={{fontFamily: "sans-serif", fontSize: "14px"}}/>
              <Bar dataKey="Registros" fill="#8884d8" />
            </BarChart>
            </ResponsiveContainer>
             : 
            <div className="chart_loading">
                <img src="/loading.gif" width="400" alt="" />
            </div> }
        </div>
    )
}

export default ChartDate
