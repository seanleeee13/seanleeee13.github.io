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
import { supabase, type LevelInterface, type ListInterface, type PListInterface } from "../supabase_key";
import { cdavg, pdavg } from "../calculate_difficulty_avg";

function Levels() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const { level_id } = useParams<{ level_id: string }>();
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
                    supabase.from("list").select("*").order("parent"),
                    supabase.from("plist").select("*")
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
    let target;
    for (let i = 0; i < lists.length; i++) {
        text = lists[i];
        if (last_data !== text.parent) {
            last_data = text.parent;
            target = plists.find((item) => item.name === last_data);
            data.push([[target?.name, target?.long_name]]);
        }
        data[data.length - 1].push([text.name, text.long_name]);
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
    console.log(level_info.co_creators);
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
                            <Box sx={{fontSize: "xl"}}>
                                <GFFIcon />
                            </Box>
                        </DialogTitle>
                        <br />
                        <Box role="presentation" sx={{p: 1}}>
                            {
                                loading ? (
                                    <>
                                        <CircularProgress />
                                        <Typography level="h4">Loading...</Typography>
                                    </>
                                ) : data.map((text, index) => (
                                    <React.Fragment key={`map-group-${index}`}>
                                        <List>
                                            <ListItem key={text[0][0]}>
                                                <Typography sx={{fontWeight: "lg"}}>{text[0][1]}</Typography>
                                            </ListItem>
                                            {text.slice(1).map((text_data) => (
                                                <ListItem key={text_data[0]}><ListItemButton component="a" href={"#/levels/" + text_data[0]}>
                                                    {text_data[1]}
                                                </ListItemButton></ListItem>
                                            ))}
                                        </List>
                                        {index < data.length - 1 && (
                                            <Divider />
                                        )}
                                    </React.Fragment>
                                ))
                            }
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <GFFIcon />
                    </IconButton>
                    <Button variant="plain" color="neutral" component="a" href="/">Main</Button>
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
                    {level_info.progress === 100 ? "" : ` (progress: ${level_info.progress}%)`}
                </Typography>
                <Typography level="title-md">{level_info.description ? `\"${level_info.description}\"` : ""}</Typography>
                <Box
                    component="img" src={level_info.image}
                    sx={{aspectRatio: "16 / 9", width: "55%"}}
                />
                <Typography level="title-md">
                    ID: {level_info.level_id}
                    {
                        pdavg(diff) !== "na" && diff ?
                        ` / 난이도: ${pdavg(diff)} (${diff[1]} / ${diff[2]}) / ` :
                        " / 난이도: N/A / "
                    }
                    등재일: {level_info.upload_time.split("T")[0]}
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