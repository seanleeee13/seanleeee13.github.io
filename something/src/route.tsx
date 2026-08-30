import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.tsx";
import Play from "./pages/play.tsx";
import Explore from "./pages/explore.tsx";

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/play/", element: <Play /> },
    { path: "/explore/", element: <Explore /> }
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;