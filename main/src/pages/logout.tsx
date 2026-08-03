import { useEffect } from "react";
import { supabase } from "../utils/supabase_key";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
        const executeLogout = async () => {
            try {
                await supabase.auth.signOut();
            } catch (error) {
                console.error("Log Out Failed:", error);
            } finally {
                navigate("/");
            }
        };
        executeLogout();
    }, []);
    return null;
}

export default Logout;