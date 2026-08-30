import { supabase } from "./supabase_key.tsx";

export const loginWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) {
        console.error("Login Fail: ", error.message);
    }
    return { data, error };
};

export const loginWithGitHub = async (redirectPath: string) => {
    await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `${window.location.origin}${redirectPath}`
        }
    });
};

export const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    if (error) {
        console.error("Sign Up Fail:", error.message);
    }
    return { data, error };
};