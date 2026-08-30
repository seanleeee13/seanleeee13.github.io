import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.tsx";
import Lists from "./pages/lists.tsx";
import Levels from "./pages/levels.tsx";
import ListsMain from "./pages/lists_main.tsx";
import LevelsMain from "./pages/levels_main.tsx";
import Upload from "./pages/upload.tsx";
import { supabase, type UserInterface } from "components/utils";
import { useState, useEffect } from "react";

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/lists/:level_list", element: <Lists /> },
    { path: "/levels/:level_id", element: <Levels /> },
    { path: "/levels/:level_list/:level_id", element: <Levels /> },
    { path: "/lists", element: <ListsMain /> },
    { path: "/levels", element: <LevelsMain /> },
    { path: "/upload", element: <Upload /> }
]);

function Router() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserInterface>();
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const {
                    data: { session }
                } = await supabase.auth.getSession();
                if (session?.user) {
                    const userResult = await supabase
                        .from("user")
                        .select("*")
                        .eq("id", session.user.id)
                        .single();
                    if (userResult.error) {
                        throw userResult.error;
                    }
                    if (userResult.data) {
                        setUsers(userResult.data as UserInterface);
                    }
                }
            } catch (err) {
                console.error("Error while loading list data: ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTableData();
    }, []);
    if (loading || !users?.role.find((value) => value[0] === "gff")) {
        return null;
    }
    return <RouterProvider router={router} />;
}

export default Router;