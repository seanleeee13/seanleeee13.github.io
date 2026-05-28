import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.tsx";
import Lists from "./pages/lists.tsx"
import Levels from "./pages/levels.tsx"

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/lists/:level_list", "element": <Lists />},
    { path: "/levels/:level_id", "element": <Levels />}
]);

function Router() {
    return (
        <RouterProvider router={router} />
    );
}

export default Router;