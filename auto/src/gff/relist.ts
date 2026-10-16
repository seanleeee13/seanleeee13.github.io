import supabase, {
    type LevelInterface,
    type ListInterface,
    type UserInterface
} from "../components/utils/supabase_key.ts";
import { cdavg } from "./utils/calculate_difficulty_avg.ts";

let levelResult, listResult, userResult;

const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

for (let i = 0; i < 5; i++) {
    await sleep(1000);
    [levelResult, listResult, userResult] = await Promise.all([
        supabase.from("level").select("*"),
        supabase.from("list").select("*").order("id"),
        supabase.from("user").select("user_metadata")
    ]);
    if (levelResult.error) {
        continue;
    }
    if (listResult.error) {
        continue;
    }
    if (userResult.error) {
        continue;
    }
    break;
}

if (levelResult!.error) {
    process.exit(1);
}
if (listResult!.error) {
    process.exit(1);
}
if (userResult!.error) {
    process.exit(1);
}

let levels = levelResult!.data as LevelInterface[];
const newLevels: LevelInterface[] = [];
const lists = listResult!.data as ListInterface[];
const TLL = lists.find((text) => text.name === "TLL");
const NLL = lists.find((text) => text.name === "NLL");
const CLL = lists.find((text) => text.name === "CLL");
const ULL = lists.find((text) => text.name === "ULL");

const users = (userResult!.data as UserInterface[])
    .map(row => ({
        "gff:id": row.user_metadata["gff:id"],
        "gff:accid": row.user_metadata["gff:accid"]
    }))
    .filter(row => row["gff:id"] && row["gff:accid"])
for (const user of users) {
    const headers = {
        "User-Agent": ""
    };
    const data = {
        "type": 5,
        "secret": "Wmfd2893gb7",
        "str": user["gff:accid"]
    };
    let response: Record<string, string>[] | null = null;
    for (let i = 0; i < 3; i++) {
        try {
            response = (await (await fetch(
                "http://www.boomlings.com/database/getGJLevels21.php",
                {
                    method: "post",
                    headers: headers,
                    body: JSON.stringify(data)
                }
            ))
                .text())
                .split("#")[0]
                .split("|")
                .map((val) => {
                    const vals = val.split(":");
                    return Object.fromEntries(
                        Array.from({ length: vals.length / 2 }, (_, x) => [vals[x * 2], vals[x * 2 + 1]])
                    );
                });
            await sleep(1000);
        } catch {
            continue;
        }
    }
    if (!response) {
        continue;
    }
    for (const level of response) {
        if (Object.entries(level).length <= 1) {
            continue;
        }
        if (level["15"] === "0") {
            continue;
        }
        if (levels.find(val => val.level_id === +level["1"])) {
            continue;
        }
        const newLevel = {
            level_id: +level["1"],
            level_name: level["2"],
            host: user["gff:id"],
            publish: user["gff:id"],
            co_creators: [] as string[],
            verifier: user["gff:id"],
            progress: null,
            description: level["3"],
            difficulty_votes: {},
            victory: [] as string[],
            image: "https://jtomgrgfszuhfqbrqgst.supabase.co/storage/v1/object/public/gd-thumbnail/placeholder.webp",
            imbed_image: null,
            gdps_id: null,
            main_id: +level["1"],
            length: +level["15"],
            original: +level["30"],
            song: level["35"] === "0" ? +level["12"] : +level["35"]
        } as LevelInterface;
        newLevels.push(newLevel);
        await supabase.from("level").upsert(newLevel);
    }
}

levels = [...levels, ...newLevels];

const levelMap = new Map<number, LevelInterface>();
for (const level of levels) {
    levelMap.set(level.level_id, level);
}

for (const level of levels) {
    const avg = cdavg(level.difficulty_votes);
    if (!avg) {
        continue;
    }
    if (avg[3] >= 0.5) {
        continue;
    }
    if (level.progress === null) {
        if (level.length === 1) {
            if (CLL && !CLL.levels.some((text) => text[0] === level.level_id)) {
                CLL.levels.push([level.level_id, ""]);
            }
        } else {
            if (avg[2] >= 0.5) {
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