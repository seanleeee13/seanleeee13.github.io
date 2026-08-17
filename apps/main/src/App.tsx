import Router from "./route.tsx";
import { extendTheme } from "@mui/joy";
import "./App.css";

const gffTheme = extendTheme({
    fontWeight: {
        xs: 200,
        sm: 300,
        md: 400,
        lg: 500,
        xl: 600,
    },
});

function App() {
    return (
        <Router />
    );
}

export default App;