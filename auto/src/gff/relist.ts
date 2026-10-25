import supabase, {
    type LevelInterface,
    type ListInterface,
    type UserInterface
} from "../components/utils/supabase_key.ts";
import { cdavg } from "./utils/calculate_difficulty_avg.ts";

let levelResult, bLevelResult, listResult, userResult;

const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

for (let i = 0; i < 5; i++) {
    await sleep(1000);
    [levelResult, bLevelResult, listResult, userResult] = await Promise.all([
        supabase.from("level").select("*"),
        supabase.from("blevel").select("*"),
        supabase.from("list").select("*").order("id"),
        supabase.from("user").select("user_metadata")
    ]);
    if (levelResult.error) {
        continue;
    }
    if (bLevelResult.error) {
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
if (bLevelResult!.error) {
    process.exit(1);
}
if (listResult!.error) {
    process.exit(1);
}
if (userResult!.error) {
    process.exit(1);
}

let levels = levelResult!.data as LevelInterface[];
let blevels = bLevelResult!.data as LevelInterface[];
const newLevels: LevelInterface[] = [];
const lists = listResult!.data as ListInterface[];
const TLL = lists.find((text) => text.name === "TLL");
const NLL = lists.find((text) => text.name === "NLL");
const CLL = lists.find((text) => text.name === "CLL");
const ULL = lists.find((text) => text.name === "ULL");
const BDL = lists.find((text) => text.name === "BDL");

const users = (userResult!.data as UserInterface[])
    .map((row) => ({
        "gff:id": row.user_metadata["gff:id"],
        "gff:accid": row.user_metadata["gff:accid"]
    }))
    .filter((row) => row["gff:id"] && row["gff:accid"]);
for (const user of users) {
    const headers = {
        "User-Agent": "",
        "Content-Type": "application/x-www-form-urlencoded"
    };
    let response: Record<string, string>[] | null = null;
    let responseSum: Record<string, string>[] = [];
    let i = 0;
    while (response) {
        const data = {
            type: "5",
            secret: "Wmfd2893gb7",
            str: `${user["gff:accid"]}`,
            page: `${i}`
        };
        for (let j = 0; j < 3; i++) {
            try {
                let x = (
                    await (
                        await fetch("http://www.boomlings.com/database/getGJLevels21.php", {
                            method: "post",
                            headers: headers,
                            body: new URLSearchParams(data).toString()
                        })
                    ).text()
                );
                if (x === "-1") {
                    continue;
                }
                response = x
                    .split("#")[0]
                    .split("|")
                    .map((val) => {
                        const vals = val.split(":");
                        return Object.fromEntries(
                            Array.from({ length: vals.length / 2 }, (_, x) => [
                                vals[x * 2],
                                vals[x * 2 + 1]
                            ])
                        );
                    });
                await sleep(1000);
                if (response) {
                    break;
                }
            } catch {
                continue;
            }
        }
        if (response) {
            responseSum = [...responseSum, ...response];
        }
        i++;
    }
    for (const level of responseSum) {
        if (Object.entries(level).length <= 1) {
            continue;
        }
        if (level["15"] === "0") {
            continue;
        }
        if (levels.find((val) => val.level_id === +level["1"])) {
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
for (const level of [...levels, ...blevels]) {
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

for (const level of blevels) {
    if (level.level_id < 0) {
        continue;
    }
    let response;
    const header = {
        "Authorization": `Bearer ${process.env.GDDL_API_KEY}`
    }
    for (let i = 0; i < 3; i++) {
        response = await fetch(`https://gdladder.com/api/levels/${level.level_id}`, { headers: header });
        if (response.ok) {
            break;
        }
    }
    if (!response!.ok) {
        continue;
    }
    const data = await response!.json();
    const rating = data.Rating;
    const headers = {
        "User-Agent": "",
        "Content-Type": "application/x-www-form-urlencoded"
    };
    const sendData = {
        type: "0",
        secret: "Wmfd2893gb7",
        str: `${level.level_id}`
    };
    let response2: Record<string, string> | null = null;
    for (let i = 0; i < 3; i++) {
        try {
            response2
            let x = (
                await (
                    await fetch("http://www.boomlings.com/database/getGJLevels21.php", {
                        method: "post",
                        headers: headers,
                        body: new URLSearchParams(sendData).toString()
                    })
                ).text()
            );
            if (x === "-1") {
                continue;
            }
            response2 = x
                .split("#")[0]
                .split("|")
                .map((val) => {
                    const vals = val.split(":");
                    return Object.fromEntries(
                        Array.from({ length: vals.length / 2 }, (_, x) => [
                            vals[x * 2],
                            vals[x * 2 + 1]
                        ])
                    );
                })[0];
            await sleep(1000);
            if (response2) {
                break;
            }
        } catch {
            continue;
        }
    }
    if (!response2) {
        continue;
    }
    const levelData = {
        level_name: response2["2"],
        progress: null,
        description: response2["3"],
        difficulty_votes: {},
        victory: [] as string[],
        gdps_id: null,
        main_id: +response2["1"],
        length: +response2["15"],
        original: +response2["30"],
        song: response2["35"] === "0" ? +response2["12"] : +response2["35"]
    } as LevelInterface;
    await supabase.from("blevel").update(levelData).eq("level_id", level.level_id);
    if (!rating) {
        await supabase
            .from("blevel")
            .update({ difficulty_votes: { GD: [0, +response2["18"], +response2["42"], 0] } })
            .eq("level_id", level.level_id);
    } else {
        await supabase
            .from("blevel")
            .update({ difficulty_votes: { GD: [1, rating, response2["42"], 0] } })
            .eq("level_id", level.level_id);
        if (level.victory.length !== 0 && response2["43"] && response2["43"] !== "3") {
            if (BDL && !BDL.levels.some((text) => text[0] === level.level_id)) {
                BDL.levels.push([level.level_id, ""]);
            }
        }
    }
}

const today = new Date();
const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

for (const list of [TLL, NLL, CLL, ULL, BDL].filter(Boolean)) {
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