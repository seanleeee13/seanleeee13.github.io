import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.tsx";
import Login from "./pages/login.tsx";
import SignUp from "./pages/signup.tsx";
import Logout from "./pages/logout.tsx";

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/login/", element: <Login /> },
    { path: "/signup/", element: <SignUp /> },
    { path: "/logout/", element: <Logout /> }
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;