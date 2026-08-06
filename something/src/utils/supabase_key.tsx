import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY = "sb_publishable_84_YWNdKNsvvxpw7TA804w_pYduB2pX";
const SUPABASE_URL = "https://jtomgrgfszuhfqbrqgst.supabase.co";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface UserInterface {
    id: string;
    role: [string, string][];
    vrole: [string, string][];
    name: string | null;
    user_metadata: {"gff:id": string, [key: string]: any};
}