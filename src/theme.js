import { createTheme } from "@material-ui/core/styles"

const theme = createTheme({
    palette: {
        primary: {
            main: "#ffae00",
            light: "#ffc13b",
            dark: "#eea300",
            contrastText: "#000000"
        },
        secondary: {
            main: "#000000",
            light: "#000000",
            dark: "#000000",
            contrastText: "#ffffff"
        }
    },
});
  
  export default theme;