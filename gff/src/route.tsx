import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.tsx";
import Lists from "./pages/lists.tsx"
import Levels from "./pages/levels.tsx"
import ListsMain from "./pages/lists_main.tsx";
import LevelsMain from "./pages/levels_main.tsx";

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/lists/:level_list", "element": <Lists />},
    { path: "/levels/:level_id", "element": <Levels />},
    { path: "/levels/:level_list/:level_id", "element": <Levels />},
    { path: "/lists", "element": <ListsMain />},
    { path: "/levels", "element": <LevelsMain />}
]);

function Router() {
    return (
        <RouterProvider router={router} />
    );
}

export default Router;