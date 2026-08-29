import supabase from "./supabase_key.ts";

async function GetLoggedIn() {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return !!session;
    } catch (error) {
        console.error("Failed to check session:", error);
        return false;
    }
}

export default GetLoggedIn;