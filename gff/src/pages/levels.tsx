import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Tooltip from "@mui/joy/Tooltip";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    supabase,
    type LevelInterface,
    type ListInterface,
    type PListInterface,
} from "components/utils";
import { AppBar } from "components";
import { cdavg, pdavg } from "../utils/calculate_difficulty_avg";

function Levels() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
    const { level_id, level_list } = useParams<{ level_id: string; level_list: string }>();
    if (!level_id) {
        return;
    }
    const n_level_id = +level_id;
    if (!Number.isInteger(n_level_id)) {
        return;
    }
    let level_info = levels.find((item) => item.level_id === n_level_id);
    if (!level_info) {
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
    if (level_list !== undefined && !flag) {
        return;
    }
    const diff = cdavg(level_info.difficulty_votes);
    if (loading) {
        return (
            <>
                <CircularProgress />
                <Typography level="h4">Loading...</Typography>
            </>
        );
    }
    type MenuListType = [string, [string, string][]][];
    return (
        <>
            <AppBar
                link={
                    level_list === undefined ?
                    [
                        ["GFF", "/gff/"], ["List", "/gff/#/lists/"],
                        [level_info.level_name, `/gff/#/levels/${level_info.level_id}/`]
                    ] :
                    [
                        ["GFF", "/gff/"], ["List", "/gff/#/lists/"],
                        [level_list, `/gff/#/lists/${level_list}/`],
                        [level_info.level_name, `/gff/#/levels/${level_list}/${level_info.level_id}/`]
                    ]
                }
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
            <Stack
                sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000, alignItems: "center" }}
                spacing={3}
            >
                <Typography level="h1">{level_info.level_name}</Typography>
                <Typography level="h4">
                    제작: {level_info.host}
                    {level_info.co_creators.length === 0 ? (
                        " / "
                    ) : (
                        <>
                            {" and "}
                            <Tooltip title={level_info.co_creators.join(", ")} arrow>
                                <Typography level="h4" sx={{ textDecoration: "underline" }}>
                                    more
                                </Typography>
                            </Tooltip>
                            {" / "}
                        </>
                    )}
                    레벨 배포: {level_info.publish} / 베리파이: {level_info.verifier}
                    {level_info.progress === null ? "" : ` (progress: ${level_info.progress}%)`}
                </Typography>
                <Typography level="title-md">
                    {level_info.description ? `"${level_info.description}"` : ""}
                </Typography>
                {level_info.imbed_image === null || level_info.imbed_image === "" ? (
                    <Box
                        component="img"
                        src={level_info.image}
                        sx={{ width: "55%", aspectRatio: "16 / 9" }}
                    />
                ) : level_info.imbed_image.includes("youtu.be") ||
                  level_info.imbed_image.includes("youtube.com") ? (
                    <iframe
                        src={level_info.imbed_image}
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                        title="YouTube video player"
                        style={{ border: 0, aspectRatio: "16 / 9" }}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        width="55%"
                    />
                ) : (
                    <Box
                        component="img"
                        src={level_info.imbed_image}
                        sx={{ width: "55%", aspectRatio: "16 / 9" }}
                    />
                )}
                <Typography level="title-md">
                    ID: {level_info.level_id}
                    {pdavg(diff) !== "na" && diff
                        ? ` / 난이도: ${pdavg(diff)} (${diff[1]} / ${diff[2]}) / `
                        : " / 난이도: N/A / "}
                    등재일: {level_info.upload_time.split("T")[0]}
                    {level_list
                        ? ` / ${level_list} 1위 기간: ` +
                          `${lists.find((item) => item.name === level_list)?.levels.find((item) => item[0] === +level_id)?.[1]}`
                        : ""}
                </Typography>
                {level_info.victory.length === 0 ? (
                    <Typography level="h3">클리어자 없음</Typography>
                ) : (
                    <>
                        <Typography level="h3">클리어자</Typography>
                        <Table color="primary" variant="outlined">
                            <thead>
                                <tr>
                                    <th>순위</th>
                                    <th>플레이어</th>
                                </tr>
                            </thead>
                            <tbody>
                                {level_info.victory.map((winner, index) => (
                                    <tr key={`tr-${index + 1}`}>
                                        <th>{index + 1}</th>
                                        <th>{winner}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </Stack>
        </>
    );
}

export default Levels;