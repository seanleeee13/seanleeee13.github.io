import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Link from "@mui/joy/Link";
import CircularProgress from "@mui/joy/CircularProgress";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
    supabase,
    type LevelInterface,
    type ListInterface,
    type PListInterface,
} from "components/utils";
import { cdavg, pdavg } from "../utils/calculate_difficulty_avg";
import { AppBar } from "components";

function Lists() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { level_list } = useParams<{ level_list: string }>();
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
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
                    supabase.from("plist").select("*").order("id"),
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
    const ratio = dimensions.width / dimensions.height;
    let cardSize: { width: number | string; height: number | string; side: "row" | "column" } = {
        width: 0,
        height: 0,
        side: "row",
    };
    let fontSizeA: "h4" | "title-lg" | "title-md";
    let fontSizeB: "title-md" | "title-sm" | "body-lg";
    let fontSizeC: "body-sm" | "body-xs";
    if (ratio >= 2) {
        cardSize = { width: "70%", height: 135, side: "row" };
    } else if (ratio >= 1.2) {
        cardSize = { width: dimensions.height * 0.75, height: 135, side: "row" };
    } else if (ratio >= 1.0) {
        cardSize = { width: "62%", height: 135, side: "row" };
    } else if (ratio >= 0.7) {
        cardSize = { width: "90%", height: 135, side: "row" };
    } else {
        cardSize = { width: "90%", height: "auto", side: "column" };
    }
    if (dimensions.width >= 1118.4) {
        fontSizeA = "h4";
        fontSizeB = "title-md";
        fontSizeC = "body-sm";
    } else if (dimensions.width >= 932) {
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
                link={[["GFF", "/gff/"], ["List", "/gff/#/lists/"], [level_list, `/gff/#/lists/${level_list}/`]]}
                list={[...data.map((text) => [
                    text[0][1], text.slice(1).map(
                        (text_data) => [text_data[1], `/gff/#/lists/${text_data[0]}/`]
                    )
                ]), [
                    "GFF", [
                        ["리스트 목록", "/gff/#/lists/"],
                        ["레벨 검색하기", "/gff/#/levels/"],
                        ["레벨 업로드", "/gff/#/upload/"]
                    ]
                ]] as MenuListType}
                content={["GFF", "/gff/"]}
            />
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
                                        <Link
                                            level={fontSizeA}
                                            fontWeight="xl"
                                            href={
                                                "/gff/#/levels/" +
                                                level_list +
                                                "/" +
                                                sel_level?.level_id
                                            }
                                            sx={{
                                                color: "black",
                                                "&:hover": { textDecorationColor: "black" },
                                            }}
                                        >{`#${index + 1} - ${sel_level.level_name}`}</Link>
                                        <Typography level={fontSizeB} fontWeight="lg">
                                            {`Host: ${sel_level.host} / Verify: ${sel_level.verifier}`}
                                        </Typography>
                                        <Typography level={fontSizeC} fontWeight="md">
                                            {`ID: ${sel_level.level_id}`}
                                            {`${
                                                pdavg(diff) !== "na" && diff
                                                    ? ` / 난이도: ${pdavg(diff)}`
                                                    : " / 난이도: N/A"
                                            }`}
                                            {text[1] === "" ? "" : ` / 1위 ${text[1]}`}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    ) : (
                        <React.Fragment key={`map-card-${index}`} />
                    );
                })}
        </>
    );
}

export default Lists;