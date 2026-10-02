import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Link from "@mui/joy/Link";
import CircularProgress from "@mui/joy/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    supabase,
    type LevelInterface,
    type ListInterface,
    type PListInterface
} from "components/utils";
import { cdavg } from "../utils/calculate_difficulty_avg.ts";
import { AppBar } from "components";

function Lists() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { level_list } = useParams<{ level_list: string }>();
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth
    });
    const navigate = useNavigate();
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const [levelResult, listResult, plistResult] = await Promise.all([
                    supabase.from("level").select("*"),
                    supabase.from("list").select("*").order("id"),
                    supabase.from("plist").select("*").order("id")
                ]);
                if (levelResult.error) {
                    throw levelResult.error;
                }
                if (listResult.error) {
                    throw listResult.error;
                }
                if (plistResult.error) {
                    throw plistResult.error;
                }
                if (levelResult.data) {
                    setLevels(levelResult.data as LevelInterface[]);
                }
                if (listResult.data) {
                    setLists(listResult.data as ListInterface[]);
                }
                if (plistResult.data) {
                    setPLists(plistResult.data as PListInterface[]);
                }
            } catch (error) {
                console.error("Error while loading list data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTableData();
    }, []);
    let cardSize: { width: number | string; height: number | string; side: "row" | "column" } = {
        width: 0,
        height: 0,
        side: "row"
    };
    let fontSizeA: "h4" | "title-lg" | "title-md";
    let fontSizeB: "title-md" | "title-sm" | "body-lg";
    let fontSizeC: "body-sm" | "body-xs";
    if (dimensions.width > 1200) {
        cardSize = { width: "70%", height: 135, side: "row" };
    } else if (dimensions.width > 1000) {
        cardSize = { width: "60%", height: 135, side: "row" };
    } else if (dimensions.width > 850) {
        cardSize = { width: "70%", height: 135, side: "row" };
    } else if (dimensions.width > 600) {
        cardSize = { width: "95%", height: 135, side: "row" };
    } else if (dimensions.width > 400) {
        cardSize = { width: "70%", height: "auto", side: "column" };
    } else {
        cardSize = { width: "95%", height: "auto", side: "column" };
    }
    if (dimensions.width >= 850) {
        fontSizeA = "h4";
        fontSizeB = "title-md";
        fontSizeC = "body-sm";
    } else if (dimensions.width >= 600) {
        fontSizeA = "h4";
        fontSizeB = "title-sm";
        fontSizeC = "body-xs";
    } else {
        fontSizeA = "h4";
        fontSizeB = "title-sm";
        fontSizeC = "body-xs";
    }
    if (loading) {
        return (
            <>
                <CircularProgress />
                <Typography level="h4">Loading...</Typography>
            </>
        );
    }
    if (!level_list) {
        return;
    }
    let text_val;
    const data = [];
    let last_data = "";
    let flag = false;
    let target;
    for (let i = 0; i < lists.length; i++) {
        text_val = lists[i];
        if (text_val.name === level_list) {
            flag = true;
        }
        if (last_data !== text_val.parent) {
            last_data = text_val.parent;
            target = plists.find((item) => item.name === last_data);
            data.push([[target?.name, target?.long_name]]);
        }
        data[data.length - 1].push([text_val.name, text_val.long_name]);
    }
    if (!flag) {
        return;
    }
    type MenuListType = [string, [string, string][]][];
    return (
        <>
            <AppBar
                link={[
                    ["GFF", "/gff/"],
                    ["List", "/gff/#/lists/"],
                    [level_list, `/gff/#/lists/${level_list}/`]
                ]}
                list={
                    [
                        ...data.map((text) => [
                            text[0][1],
                            text
                                .slice(1)
                                .map((text_data) => [text_data[1], `/gff/#/lists/${text_data[0]}/`])
                        ]),
                        [
                            "GFF",
                            [
                                ["리스트 목록", "/gff/#/lists/"],
                                ["레벨 검색하기", "/gff/#/levels/"],
                                ["레벨 업로드", "/gff/#/upload/"]
                            ]
                        ]
                    ] as MenuListType
                }
                content={["GFF", "/gff/"]}
            />
            <Box
                sx={{
                    overflowY: "auto",
                    height: "calc(100vh - 64px)",
                    scrollbarGutter: "stable both-edges"
                }}
            >
                <Typography level="h1" sx={{ display: "flex", justifySelf: "center", mt: 5 }}>
                    {lists
                        .find((item) => item.name === level_list)
                        ?.long_name ?? ""}
                </Typography>
                {lists
                    .find((item) => item.name === level_list)
                    ?.levels.map((text, index) => {
                        let sel_level = levels.find((item) => item.level_id === text[0]);
                        let diff = cdavg(sel_level?.difficulty_votes);
                        return sel_level ? (
                            <Card
                                key={`map-card-${index}`}
                                sx={{
                                    width: cardSize.width,
                                    display: "flex",
                                    justifySelf: "center",
                                    my: 5,
                                    height: cardSize.height,
                                    overflow: "hidden",
                                    p: 0,
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    navigate(
                                        "/levels/" + level_list + "/" + sel_level?.level_id + "/"
                                    );
                                }}
                            >
                                <CardContent sx={{ height: "100%" }}>
                                    <Stack
                                        spacing={1}
                                        direction={cardSize.side}
                                        sx={{ height: "100%" }}
                                    >
                                        <Box
                                            component="img"
                                            src={sel_level.image}
                                            sx={{ aspectRatio: "16 / 9", height: "100%" }}
                                        />
                                        <Stack spacing={1} sx={{ p: 2 }}>
                                            <Stack spacing={1} direction="row">
                                                <Link
                                                    level={fontSizeA}
                                                    fontWeight="xl"
                                                    href={
                                                        "/gff/#/levels/" +
                                                        level_list +
                                                        "/" +
                                                        sel_level?.level_id +
                                                        "/"
                                                    }
                                                    sx={{
                                                        color: "black",
                                                        "&:hover": { textDecorationColor: "black" }
                                                    }}
                                                >
                                                    {`#${index + 1} - ${sel_level.level_name}`}
                                                </Link>
                                                <img
                                                    src={`/gff/assets/${
                                                        diff && diff[3] < 0.5
                                                            ? diff[0] === 0
                                                                ? {
                                                                    1: "auto",
                                                                    2: "easy",
                                                                    3: "normal",
                                                                    4: "hard",
                                                                    5: "hard",
                                                                    6: "harder",
                                                                    7: "harder",
                                                                    8: "insane",
                                                                    9: "insane"
                                                                }[Math.round(diff[1])]
                                                                : diff[1] <= 5
                                                                ? "demon-easy"
                                                                : diff[1] <= 10
                                                                    ? "demon-medium"
                                                                    : diff[1] <= 15
                                                                    ? "demon-hard"
                                                                    : diff[1] <= 20
                                                                        ? "demon-insane"
                                                                        : "demon-extreme"
                                                            : "unrated"
                                                    }${
                                                        diff && diff[3] < 0.5
                                                            ? {
                                                                0: "",
                                                                1: "-featured",
                                                                2: "-epic",
                                                                3: "-legendary",
                                                                4: "-mythic"
                                                            }[Math.round(diff[2])]
                                                            : ""
                                                    }.png`}
                                                    width="30px"
                                                    height="30px"
                                                />
                                            </Stack>
                                            <Typography level={fontSizeB} fontWeight="lg">
                                                {`Host: ${sel_level.host} / Verify: ${sel_level.verifier}`}
                                            </Typography>
                                            <Typography level={fontSizeC} fontWeight="md">
                                                {`ID: ${sel_level.level_id}`}
                                                {text[1] === "" ? "" : ` / 1위 ${text[1]}`}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ) : null;
                    })}
            </Box>
        </>
    );
}

export default Lists;