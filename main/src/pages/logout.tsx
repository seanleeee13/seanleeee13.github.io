import { useEffect } from "react";
import { supabase } from "components/utils";
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
    }, [navigate]);
    return null;
}

export default Logout;