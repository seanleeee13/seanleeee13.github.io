import CssBaseline from "@mui/joy/CssBaseline";
import Router from "./route.tsx";
import { extendTheme, CssVarsProvider } from "@mui/joy";
import "./App.css";

const gffTheme = extendTheme({ 
    fontFamily: {
        body: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
        display: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
    },
    fontWeight: {
        xs: 200,
        sm: 300,
        md: 400,
        lg: 500,
        xl: 600
    }
})

function App() {
    return (
        <CssVarsProvider theme={gffTheme}>
            <CssBaseline />
            <Router />
        </CssVarsProvider>
    );
}

export default App;