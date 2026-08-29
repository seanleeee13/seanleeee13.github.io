import { useEffect } from "react";
import { supabase } from "components/utils";

function Logout() {
    useEffect(() => {
        const executeLogout = async () => {
            try {
                await supabase.auth.signOut();
            } catch (error) {
                console.error("Log Out Failed:", error);
            } finally {
                window.location.href = "/";
            }
        };
        executeLogout();
    }, []);
    return null;
}

export default Logout;