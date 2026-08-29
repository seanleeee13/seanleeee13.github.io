import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY = "sb_publishable_84_YWNdKNsvvxpw7TA804w_pYduB2pX";
const SUPABASE_URL = "https://jtomgrgfszuhfqbrqgst.supabase.co";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;

export interface LevelInterface {
    level_id: number;
    level_name: string;
    host: string;
    publish: string;
    co_creators: string[];
    verifier: string;
    progress: number;
    description: string;
    difficulty_votes: Record<string, number[]>;
    victory: string[];
    image: string;
    upload_time: string;
    imbed_image: string;
}

export interface ListInterface {
    id: number;
    name: string;
    long_name: string;
    levels: [number, string][];
    parent: string;
}

export interface PListInterface {
    id: number;
    name: string;
    long_name: string;
    childs: string[];
}

export interface UserInterface {
    id: string;
    role: [string, string][];
    vrole: [string, string][];
    name: string | null;
    user_metadata: { "gff:id": string; [key: string]: unknown };
}