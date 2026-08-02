import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.tsx";
import Play from "./pages/play.tsx";

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/play/", element: <Play /> }
]);

function Router() {
    return (
        <RouterProvider router={router} />
    );
}

export default Router;