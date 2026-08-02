import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Play from "./pages/play.tsx";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play/" element={<Play />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;