import React from 'react'
import { db, storage } from "./firebase"
import {useHistory} from "react-router"
import XLSX from "xlsx"
import { saveAs } from 'file-saver'
const dateFormat = require("dateformat")

export const TicketsContext = React.createContext()

const TicketsProvider = ({ children }) => {

    // VARIABLES
    const [tickets, setTickets] = React.useState([])
    const [ticketsLoaded, setTicketsLoaded] = React.useState(false)
    const [providers, setProviders] = React.useState([])
    const [providersLoaded, setProvidersLoaded] = React.useState(false)
    const [ticketsNextBtn, setTicketsNextBtn] = React.useState(false)
    const [ticketsPreviousBtn, setTicketsPreviousBtn] = React.useState(false)
    const [firstDocument, setFirstDocument] = React.useState(null)
    const [lastDocument, setLastDocument] = React.useState(null)
    const [showExcelPopup, setShowExcelPopup] = React.useState(false)
    const history = useHistory()

    // GET ALL DATA - Get the 10 initial tickets
    async function getAllData() {
        // Set initial table values
        setTicketsPreviousBtn(false)
        setTicketsNextBtn(false)
        setTicketsLoaded(false)

        try{
            // Get the first 10 tickets
            const data = await db.collection("Registro").orderBy("Fecha", "desc").limit(10).get()
            setTickets(data.docs)

            // Set the first and last documents for the next and previous fetchs
            setFirstDocument(data.docs[0])
            setLastDocument(data.docs[data.docs.length - 1])

            // Set initial table values
            setTicketsPreviousBtn(false)
            setTicketsNextBtn(true)
            setTicketsLoaded(true)
        }
        catch(error){
            console.log("TICKETS ERROR:", error)
        }
    }

    // GET NEXT DATA - Get the 10 next tickets in DB according to the actual tickets
    async function getAllNextData() {
        // Set initial table values
        setTicketsPreviousBtn(false)
        setTicketsNextBtn(false)
        setTicketsLoaded(false)
        try{
            // Get the next 10 tickets
            const data = await db.collection("Registro").orderBy("Fecha", "desc").startAfter(lastDocument).limit(10).get()

            // If there are docs in the result
            if (data.docs.length > 0){
                // Set the tickets
                setTickets(data.docs)
                setFirstDocument(data.docs[0])
                setLastDocument(data.docs[data.docs.length - 1])

                // Set initial table buttons
                setTicketsPreviousBtn(true)
                setTicketsNextBtn(true)
            }
            else{
                // Set the tickets to empty array
                setTickets([])

                // Set initial table buttons
                setTicketsPreviousBtn(true)
                setTicketsNextBtn(false)
            }
            setTicketsLoaded(true)
        }
        catch(error){
            console.log("NEXT TICKETS ERROR:", error)
        }
    }

    // GET PREVIOUS DATA - Get the 10 previous tickets in DB according to the actual tickets
    async function getAllPreviousData() {
        // Set initial table values
        setTicketsPreviousBtn(false)
        setTicketsNextBtn(false)
        setTicketsLoaded(false)
        try{
            // Get the previous 10 tickets
            const data = await db.collection("Registro").orderBy("Fecha", "desc").endBefore(firstDocument).limitToLast(10).get()

            // If there are docs in the result
            if (data.docs.length > 0){
                // Set the tickets
                setTickets(data.docs)
                setFirstDocument(data.docs[0])
                setLastDocument(data.docs[data.docs.length - 1])

                // Set initial table buttons
                setTicketsPreviousBtn(true)
                setTicketsNextBtn(true)
            }
            else{
                // Set initial table buttons
                setTicketsPreviousBtn(false)
                setTicketsNextBtn(true)
            }
            setTicketsLoaded(true)
        }
        catch(error){
            console.log("PREVIOUS TICKETS ERROR:", error)
        }
    }

    // BASIC FILTER DATA - Filter tickets in DB with only one parameter and one value
    async function basicFilterData(field, value, nextDate){
        // Set initial table values
        setTicketsPreviousBtn(false)
        setTicketsNextBtn(false)
        setTicketsLoaded(false)

        try{
            // If its a date filtration
            if (field === "Fecha"){
                // Find all tickets between the selected day and the day after
                const data = await db.collection("Registro").where(field, ">=", value).where(field, "<", nextDate).orderBy("Fecha", "desc").get()
                setTickets(data.docs)
            }
            else{
                // Find all tickets that match the filtration
                const data = await db.collection("Registro").where(field, "==", value).get()

                // Sort the data by date
                const sortedData = data.docs.sort((a, b) => {
                    const aDate = new Date(a?.data().Fecha.toDate())
                    const bDate = new Date(b?.data().Fecha.toDate())
                    if (aDate < bDate) return 1
                    else if (aDate > bDate) return -1
                    else return 0
                })

                // Set sorted tickets
                setTickets(sortedData)
            }
            setTicketsLoaded(true)
        }
        catch(error){
            console.log("BASIC FILTER ERROR:", error)
        }
    }

    // ADVANCED FILTER DATA - Filter tickets in DB with several parameters and values
    async function advancedFilterData(fechaInicial, fechaFinal, proveedor, cliente, operador, volumen){
        // Set initial table values
        setTicketsPreviousBtn(false)
        setTicketsNextBtn(false)
        setTicketsLoaded(false)

        // Change dates
        fechaInicial = new Date(fechaInicial.replaceAll('-', ','))
        fechaFinal = new Date(fechaFinal.replaceAll('-', ','))

        // Get data by dates
        try{
            var tickets = await db.collection("Registro").where("Fecha", ">=", fechaInicial).where("Fecha", "<", fechaFinal).orderBy("Fecha", "desc").get()
            tickets = tickets.docs

            // Change volume type
            if (volumen !== "") volumen = parseInt(volumen)
            
            // Filter by fields
            if (proveedor !== "") tickets = tickets.filter(ticket => ticket?.data().Proveedor === proveedor)
            if (cliente !== "") tickets = tickets.filter(ticket => ticket?.data().Cliente === cliente)
            if (operador !== "") tickets = tickets.filter(ticket => ticket?.data().Operador === operador)
            if (volumen !== "") tickets = tickets.filter(ticket => ticket?.data().Volumen === volumen)

            // Set tickets
            setTickets(tickets)
            setTicketsLoaded(true)
        }
        catch(error){
            console.log(error)
        }
    }

    // UPDATE TICKET - Change values of a ticket in the DB
    async function updateTicket(id, cliente, proveedor, operador, placas, volumen, comentarios, changeImgState, imgSelected, imgName){
        // Change volume type and comments value if null
        volumen = parseInt(volumen)
        if (comentarios === "") comentarios = null
        
        // Create new ticket object
        const newData = {
            Cliente: cliente,
            Proveedor: proveedor,
            Operador: operador,
            Placas: placas,
            Volumen: volumen,
            Comentarios: comentarios
        }

        try{
            // Update ticket data on the DB
            await db.collection("Registro").doc(id).update(newData)
            
            // If change img state is true and the img is valid change it on storage
            if ( changeImgState && imgSelected !== null && imgName !== "" && 
               ( imgSelected.type === "image/png" || imgSelected.type === "image/jpeg" || imgSelected.type === "image/jpg" )){
                // Put the image in the storage ref
                const imgRef = storage.ref(`imagenes/${imgName}`)
                await imgRef.put(imgSelected)
            }

            // Go to the tickets details
            history.push(`/private/details/${id}`)
        }
        catch(error) {
            console.log("ERROR UPDATE TICKET:", error)
        }
    }

    // GET PROVIDERS -  Get all the providers in DB
    async function getProviders(){
        try{
            const data = await db.collection("Proveedores").orderBy("Proveedor", "asc").get()
            setProviders(data.docs)
            setProvidersLoaded(true)
        }
        catch(error){
            console.log("PROVIDERS ERROR:", error)
        }
    }

    // CREATE PROVIDER - Add a new provider to the DB
    async function createProvider(name){
        try{
            // Available ID flag
            var availableId = false
            var id

            // Limit searches counter
            var limitCounter = 0

            // While the generated id is not availableId or it reaches the limit of searches
            while ( !availableId && limitCounter !== 200 ){
                // Generate random number of 4 digits
                id = ( Math.floor( Math.random() * (10000 - 1000) + 1000 ) ).toString()

                // Search in DB if its available
                const res = await db.collection("Proveedores").doc(id).get()

                // If the result doesnt exists its because the id is available
                if (!res.exists) availableId = true

                // Increase limit counter
                limitCounter++
            }

            // If it reaches the limit return
            if (limitCounter === 200){
                alert("No se pudo encontrar un ID disponible, elimine algunos provedores para liberar espacio.")
                return
            }

            // Add provider to DB
            await db.collection("Proveedores").doc(id).set({Proveedor: name})

            // Update providers in context
            getProviders()
        }
        catch(error){
            console.log("CREATE PROVIDER ERROR", error)
        }
    }

    // DELETE PROVIDER
    async function deleteProvider(id){
        // Confirm delete
        const confirm = window.confirm("¿Seguro que quieres borrar este proveedor?")

        if (confirm){
            try{
                // Delete doc in DB
                await db.collection("Proveedores").doc(id).delete()

                // Filter provider in the context
                const filteredProviders = providers.filter(provider => provider.id !== id)
                setProviders(filteredProviders)
            }
            catch(error){
                console.log(error)
            }
        }
    }

    // DOWNLOAD EXCEL - Create an excel Blob to download the tickets data
    async function downloadExcel(type){
        // Set Labels
        const data = []
        const headers = ["Cliente", "Fecha", "Proveedor", "Operador", "Placas", "Volumen", "Comentarios"]
        data.push(headers)

        // Make the excel with only the tickets on the context
        if (type === "filtered"){
            // For each ticket
            tickets.forEach( ticket => {
                // For each field
                const row = []
                row.push(ticket?.data().Cliente ? ticket?.data().Cliente : "No disponible")
                row.push(ticket?.data().Fecha ? dateFormat(new Date(ticket?.data().Fecha.toDate()), "mediumDate") : "No disponible")
                row.push(ticket?.data().Proveedor ? ticket?.data().Proveedor : "No disponible")
                row.push(ticket?.data().Operador ? ticket?.data().Operador : "No disponible")
                row.push(ticket?.data().Placas ? ticket?.data().Placas : "No disponible")
                row.push(ticket?.data().Volumen ? ticket?.data().Volumen : "No disponible")
                row.push(ticket?.data().Comentarios ? ticket?.data().Comentarios : "No disponible")
                data.push(row)
            })
        }

        else if (type === "all"){
            try{
                // Get all tickets in DB
                const dataDB = await db.collection("Registro").orderBy("Fecha", "desc").get()
                const allTickets = dataDB.docs

                // For each ticket
                allTickets.forEach( ticket => {
                    // For each field
                    const row = []
                    row.push(ticket?.data().Cliente ? ticket?.data().Cliente : "No disponible")
                    row.push(ticket?.data().Fecha ? dateFormat(new Date(ticket?.data().Fecha.toDate()), "mediumDate") : "No disponible")
                    row.push(ticket?.data().Proveedor ? ticket?.data().Proveedor : "No disponible")
                    row.push(ticket?.data().Operador ? ticket?.data().Operador : "No disponible")
                    row.push(ticket?.data().Placas ? ticket?.data().Placas : "No disponible")
                    row.push(ticket?.data().Volumen ? ticket?.data().Volumen : "No disponible")
                    row.push(ticket?.data().Comentarios ? ticket?.data().Comentarios : "No disponible")
                    data.push(row)
                })
            }
            catch(error){
                console.log("ALL TICKETS EXCEL ERROR:", error)
            }
        }

        // Create workbook
        var wb = XLSX.utils.book_new()
        wb.Props = {
            Title: "Registros",
            Subject: "Registros de Osega",
            Author: "Osega",
            CreatedDate: new Date()
        }
        wb.SheetNames.push("Registros")
        var ws = XLSX.utils.aoa_to_sheet(data)
        wb.Sheets["Registros"] = ws
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'})
        function s2ab(s) { 
            var buf = new ArrayBuffer(s.length)
            var view = new Uint8Array(buf)
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
            return buf    
        }
        saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), 'Registros.xlsx')
    }

    // USE EFFECT - Execute this functions after rendering
    React.useEffect(() => {
        getAllData()
        getProviders()
    }, [])

    return (
        <TicketsContext.Provider value={{ 
                tickets, 
                ticketsLoaded, 
                getAllData,
                basicFilterData, 
                advancedFilterData,
                updateTicket, 
                providers, 
                providersLoaded, 
                createProvider, 
                deleteProvider,
                ticketsNextBtn,
                ticketsPreviousBtn,
                getAllNextData,
                getAllPreviousData,
                showExcelPopup, 
                setShowExcelPopup,
                downloadExcel
            }}>
            {children}
        </TicketsContext.Provider>
    )
}

export default TicketsProvider
