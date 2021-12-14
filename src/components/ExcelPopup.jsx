import React from 'react'
import Typography from '@material-ui/core/Typography'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { TicketsContext } from '../TicketsContext';
import { makeStyles } from '@material-ui/core/styles';

// STYLES
const useStyles = makeStyles({
    title: {
        margin: "0px 0px 10px 0px"
    },
    btn: {
        marginTop: "20px"
    }
});

const types = {
    filtered: "filtered",
    all: "all"
}

// COMPONENT
const ExcelPopup = () => {

    const classes = useStyles()
    const [excelType, setExcelType] = React.useState(types.filtered)
    const {setShowExcelPopup, downloadExcel} = React.useContext(TicketsContext)

    // HANDLE CLICK
    function handleClick() {
        downloadExcel(excelType)
        setShowExcelPopup(false)
    }

    return (
        <div className="excel_popup_container">
            <div className="excel_popup">
                <CloseIcon onClick={() => setShowExcelPopup(false)}/>
                <form>
                <Typography variant="h6" className={classes.title}>Tipo de Excel</Typography>
                <RadioGroup aria-label="gender" name="gender1" value={excelType} onChange={e => setExcelType(e.target.value)}>
                    <FormControlLabel value={types.filtered} control={<Radio color="primary"/>} label="Registros Mostrados en la Tabla Inferior" />
                    <FormControlLabel value={types.all} control={<Radio color="primary"/>} label="Todos los Registros de la Base de Datos" />
                </RadioGroup>
                <Button type="button" variant="contained" size="small" color="primary" className={classes.btn} onClick={handleClick}>Descargar Excel</Button>
                </form>
            </div>      
        </div>
    )
}

export default ExcelPopup
