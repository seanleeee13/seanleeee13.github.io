import Typography from "@mui/joy/Typography";
import MenuIcon from "../assets/menu";
import GFFIcon from "../assets/gff";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import Button from "@mui/joy/Button"
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Divider from "@mui/joy/Divider";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import CircularProgress from "@mui/joy/CircularProgress";
import Table from "@mui/joy/Table";
import Tooltip from "@mui/joy/Tooltip";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { supabase, type LevelInterface, type ListInterface, type PListInterface } from "../utils/supabase_key";
import { cdavg, pdavg } from "../utils/calculate_difficulty_avg";
import ExpandMoreIcon from "../assets/expand_more";

function Levels() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const { level_id, level_list } = useParams<{ level_id: string, level_list: string }>();
    if (!level_id) {
        return;
    }
    const n_level_id = +level_id;
    if (!Number.isInteger(n_level_id)) {
        return;
    }
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
    let level_info = levels.find((item) => item.level_id === n_level_id);
    if (!level_info) {
        return;
    }
    let text;
    const data = [];
    let last_data = "";
    let flag = false;
    let target;
    for (let i = 0; i < lists.length; i++) {
        text = lists[i];
        if (text.name === level_list) {
            flag = true;
        }
        if (last_data !== text.parent) {
            last_data = text.parent;
            target = plists.find((item) => item.name === last_data);
            data.push([[target?.name, target?.long_name]]);
        }
        data[data.length - 1].push([text.name, text.long_name]);
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
    return (
        <>
            <Sheet
            variant="solid"
            color="neutral"
            sx={{
                top: 0,
                zIndex: 1100,
                width: "100%",
                height: "64px",
                px: 2,
                display: "flex",
                alignItems: "center",
                borderBottom: "1.5px solid #bcbfb6",
                borderColor: "divider",
                bgcolor: "#f6f8fa",
            }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{width: "100%"}}
                >
                    <IconButton variant="outlined" color="neutral" size="md" onClick={() => setOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer open={open} onClose={() => setOpen(false)} size="sm">
                        <ModalClose />
                        <DialogTitle>
                            <Box>
                                <IconButton sx={{
                                    width: "35px",height: "35px",
                                    "& svg": {
                                    fontSize: "30px"
                                    }
                                }} component="a" href="/">
                                    <GFFIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <br />
                        <Box role="presentation" sx={{p: 1}}>
                            {data.map((text, index) => (
                                <React.Fragment key={`map-group-${index}`}>
                                    <List>
                                        <ListItem key={text[0][0]}>
                                            <Typography sx={{fontWeight: "lg"}}>{text[0][1]}</Typography>
                                        </ListItem>
                                        {text.slice(1).map((text_data) => (
                                            <ListItem key={text_data[0]}>
                                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href={"/gff/#/lists/" + text_data[0]}>
                                                    {text_data[1]}
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Divider />
                                </React.Fragment>
                            ))}
                            <List>
                                <ListItem>
                                    <Typography sx={{fontWeight: "lg"}}>모든 기능</Typography>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href={"/gff/#/lists/"}>
                                        리스트 목록
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href={"/gff/#/levels/"}>
                                        레벨 검색하기
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href={"/gff/#/upload/"}>
                                        레벨 업로드하기
                                    </ListItemButton>
                                </ListItem>
                            </List>
                            <Divider />
                            <List>
                                <ListItem>
                                    <Typography sx={{fontWeight: "lg"}}>공통 기능</Typography>
                                </ListItem>
                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href="/#/logout/">
                                    로그아웃
                                </ListItemButton>
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <GFFIcon />
                    </IconButton>
                    <Divider orientation="vertical" />
                    {
                        level_list === undefined ?
                        <>
                            <Button variant="plain" color="neutral" component="a" href="/gff/">GFF</Button>
                            <Typography sx={{transform: "rotate(270deg)"}}><ExpandMoreIcon /></Typography>
                            <Button variant="plain" color="neutral" component="a" href="/gff/#/levels">Level</Button>
                            <Typography sx={{transform: "rotate(270deg)"}}><ExpandMoreIcon /></Typography>
                            <Button variant="plain" color="neutral" component="a" href={`/gff/#/levels/${level_id}`}>
                                {level_info.level_name}
                            </Button>
                        </> :
                        <>
                            <Button variant="plain" color="neutral" component="a" href="/gff/">GFF</Button>
                            <Typography sx={{transform: "rotate(270deg)"}}><ExpandMoreIcon /></Typography>
                            <Button variant="plain" color="neutral" component="a" href="/gff/#/lists">List</Button>
                            <Typography sx={{transform: "rotate(270deg)"}}><ExpandMoreIcon /></Typography>
                            <Button variant="plain" color="neutral" component="a" href={`/gff/#/lists/${level_list}`}>{level_list}</Button>
                            <Typography sx={{transform: "rotate(270deg)"}}><ExpandMoreIcon /></Typography>
                            <Button variant="plain" color="neutral" component="a" href={`/gff/#/levels/${level_id}`}>
                                {level_info.level_name}
                            </Button>
                        </>
                    }
                </Stack>
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={2}
                    sx={{width: "100%"}}
                >
                    <Button variant="plain" color="neutral" component="a" href="/#/logout/">Log Out</Button>
                </Stack>
            </Sheet>
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000, alignItems: "center" }} spacing={3}>
                <Typography level="h1">{level_info.level_name}</Typography>
                <Typography level="h4">
                    제작: {level_info.host}{
                        level_info.co_creators.length === 0 ? " / " :
                        (
                            <>
                                {" and "}
                                <Tooltip title={level_info.co_creators.join(", ")} arrow>
                                    <Typography level="h4" sx={{textDecoration: "underline"}}>
                                        more
                                    </Typography>
                                </Tooltip>
                                {" / "}
                            </>
                        )
                    }
                    레벨 배포: {level_info.publish} / 베리파이: {level_info.verifier}
                    {level_info.progress === null ? "" : ` (progress: ${level_info.progress}%)`}
                </Typography>
                <Typography level="title-md">{level_info.description ? `\"${level_info.description}\"` : ""}</Typography>
                {
                    level_info.imbed_image === null || level_info.imbed_image === "" ?
                    <Box component="img" src={level_info.image} sx={{width: "55%", aspectRatio: "16 / 9"}} /> :
                    (
                        level_info.imbed_image.includes("youtu.be") || level_info.imbed_image.includes("youtube.com") ?
                        <iframe
                            src={level_info.imbed_image}
                            title="YouTube video player"
                            style={{border: 0, aspectRatio: "16 / 9"}}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            width="55%"
                        /> :
                        <Box component="img" src={level_info.imbed_image} sx={{width: "55%", aspectRatio: "16 / 9"}} />
                    )
                }
                <Typography level="title-md">
                    ID: {level_info.level_id}
                    {
                        pdavg(diff) !== "na" && diff ?
                        ` / 난이도: ${pdavg(diff)} (${diff[1]} / ${diff[2]}) / ` :
                        " / 난이도: N/A / "
                    }
                    등재일: {level_info.upload_time.split("T")[0]}
                    {
                        level_list ?
                        ` / ${level_list} 1위 기간: `
                        + `${lists.find((item) => item.name === level_list)?.levels.find((item) => item[0] === +level_id)?.[1]}`
                        : ""
                    }
                </Typography>
                {
                    level_info.victory.length === 0 ? <Typography level="h3">클리어자 없음</Typography> :
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
                                    <tr>
                                        <th>{index + 1}</th>
                                        <th>{winner}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                }
            </Stack>
        </>
    )
}

export default Levels;