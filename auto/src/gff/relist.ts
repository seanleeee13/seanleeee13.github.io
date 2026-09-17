import supabase, {
    type LevelInterface,
    type ListInterface
} from "../components/utils/supabase_key.ts";
import { cdavg } from "./utils/calculate_difficulty_avg.ts";

const [levelResult, listResult] = await Promise.all([
    supabase.from("level").select("*"),
    supabase.from("list").select("*").order("id")
]);

if (levelResult.error) {
    process.exit(1);
}
if (listResult.error) {
    process.exit(1);
}

const levels = levelResult.data as LevelInterface[];
const lists = listResult.data as ListInterface[];
const TLL = lists.find((text) => text.name === "TLL");
const NLL = lists.find((text) => text.name === "NLL");
const CLL = lists.find((text) => text.name === "CLL");
const ULL = lists.find((text) => text.name === "ULL");

const levelMap = new Map<number, LevelInterface>();
for (const level of levels) {
    levelMap.set(level.level_id, level);
}

for (const level of levels) {
    if (level.progress === null) {
        if (level.length === 1) {
            if (CLL && !CLL.levels.some((text) => text[0] === level.level_id)) {
                CLL.levels.push([level.level_id, ""]);
            }
        } else {
            const avg = cdavg(level.difficulty_votes);
            if (avg && avg[2] > 1) {
                if (TLL && !TLL.levels.some((text) => text[0] === level.level_id)) {
                    TLL.levels.push([level.level_id, ""]);
                }
            }
            if (NLL && !NLL.levels.some((text) => text[0] === level.level_id)) {
                NLL.levels.push([level.level_id, ""]);
            }
        }
    } else {
        if (ULL && !ULL.levels.some((text) => text[0] === level.level_id)) {
            ULL.levels.push([level.level_id, ""]);
        }
    }
}

const today = new Date();
const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

for (const list of [TLL, NLL, CLL, ULL].filter(Boolean)) {
    list!.levels.sort((a, b) => {
        const ao = levelMap.get(a[0])!;
        const bo = levelMap.get(b[0])!;
        const ad = cdavg(ao.difficulty_votes);
        const bd = cdavg(bo.difficulty_votes);
        const an = ad ? ad[0] * 10 + ad[1] : 0;
        const bn = bd ? bd[0] * 10 + bd[1] : 0;
        return bn - an;
    });
    for (let i = 0; i < list!.levels.length; i++) {
        let [id, f] = list!.levels[i];
        if (i === 0) {
            if (!f.endsWith("~")) {
                f += `${f ? ", " : ""}${date}~`;
            }
        } else {
            if (f.endsWith("~")) {
                f += date;
            }
        }
        list!.levels[i] = [id, f];
    }
    await supabase.from("list").update({ levels: list!.levels }).eq("name", list!.name);
}