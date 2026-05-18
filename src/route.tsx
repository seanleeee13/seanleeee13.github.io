import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.tsx";

const router = createHashRouter([
    { path: "/", element: <Home /> }
]);

function Router() {
    return (
        <RouterProvider router={router} />
    );
}

export default Router;