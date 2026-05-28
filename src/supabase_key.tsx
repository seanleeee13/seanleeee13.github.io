import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY = "sb_publishable_84_YWNdKNsvvxpw7TA804w_pYduB2pX";
const SUPABASE_URL = "https://jtomgrgfszuhfqbrqgst.supabase.co";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
}

export interface ListInterface {
    name: string;
    long_name: string;
    levels: number[];
    parent: string;
}

export interface PListInterface {
    name: string;
    long_name: string;
    childs: string[];
}


// const data = [
//     [
//         ["FLL", "Friend Level List / 공식 레벨 순위"],
//         ["TLL", "Featured Level List / 피쳐드 레벨 순위"],
//         ["ELL", "Epic Level List / 에픽 레벨 순위"],
//         ["NLL", "Unfeatured Level List / 모든 레벨 순위"],
//         ["CLL", "Challenge Level List / 챌린지 레벨 순위"],
//         ["ULL", "Unverified Level List / 언베리파이드 레벨 순위"],
//         ["ILL", "Impossible Level List / 불가능 레벨 순위"],
//         ["RLL", "Creating Level List / 레벨 크리에이팅 순위"]
//     ],
//     [
//         ["BLL", "Beated Level List / 깬 레벨 순위"],
//         ["BDL", "Beated Demon List / 깬 데몬 순위"]
//     ]
// ];