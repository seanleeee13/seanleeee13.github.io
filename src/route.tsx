import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.tsx";
import Levels from "./pages/levels.tsx"

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/levels/:level_list", "element": <Levels />}
]);

function Router() {
    return (
        <RouterProvider router={router} />
    );
}

export default Router;