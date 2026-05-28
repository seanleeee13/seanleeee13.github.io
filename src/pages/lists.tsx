import Typography from "@mui/joy/Typography";
import MenuIcon from "../assets/menu";
import GFFIcon from "../assets/gff";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import Button from "@mui/joy/Button"
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Link from "@mui/joy/Link";
import Divider from "@mui/joy/Divider";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import CircularProgress from "@mui/joy/CircularProgress";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { supabase, type LevelInterface, type ListInterface, type PListInterface } from "../supabase_key";
import { cdavg, pdavg } from "../calculate_difficulty_avg";

function Lists() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { level_list } = useParams<{ level_list: string }>();
    const [open, setOpen] = useState(false);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
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
    const ratio = dimensions.width / dimensions.height;
    let cardSize: {width: number | string, height: number | string, side: "row" | "column"} = {width: 0, height: 0, side: "row"};
    let fontSizeA: "h4" | "title-lg" | "title-md";
    let fontSizeB: "title-md" | "title-sm" | "body-lg";
    let fontSizeC: "body-sm" | "body-xs";
    if (ratio >= 2) {
        cardSize = {width: "70%", height: 135, side: "row"};
    } else if (ratio >= 1.2) {
        cardSize = {width: dimensions.height * 0.75, height: 135, side: "row"};
    } else if (ratio >= 1.0) {
        cardSize = {width: "62%", height: 135, side: "row"};
    } else if (ratio >= 0.7) {
        cardSize = {width: "90%", height: "auto", side: "row"};
    } else {
        cardSize = {width: "90%", height: "auto", side: "column"};
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
    if (!flag) {
        return;
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
            {lists.find((item) => item.name === level_list)?.levels.map((text, index) => {
                let sel_level = levels.find((item) => item.level_id === text);
                let diff = cdavg(sel_level?.difficulty_votes);
                return (
                    sel_level ? (
                        <Card
                            key={`map-card-${index}`}
                            sx={{
                                width: cardSize.width, display: "flex", justifySelf: "center",
                                my: 5, height: cardSize.height, overflow: "hidden", p: 0
                            }}
                        >
                            <CardContent sx={{height: "100%"}}>
                                <Stack spacing={1} direction={cardSize.side} sx={{height: "100%"}}>
                                    <Box
                                        component="img" src={sel_level.image}
                                        sx={{aspectRatio: "16 / 9", height: "100%"}}
                                    />
                                    <Stack spacing={1} sx={{p: 2}}>
                                        <Link
                                            level={fontSizeA} fontWeight="xl" href={"/#/levels/" + sel_level?.level_id}
                                            sx={{color: "black", "&:hover": {textDecorationColor: "black"}}}
                                        >{`#${index + 1} - ${sel_level.level_name}`}</Link>
                                        <Typography level={fontSizeB} fontWeight="lg">
                                            {`Host: ${sel_level.host} / Verify: ${sel_level.verifier}`}
                                        </Typography>
                                        <Typography level={fontSizeC} fontWeight="md">
                                            {`ID: ${sel_level.level_id}`}
                                            {
                                                `${pdavg(diff) !== "na" && diff ?
                                                ` / Difficulty: ${pdavg(diff)} (${diff[1]} / ${diff[2]})` :
                                                " / Difficulty: N/A"}`
                                            }
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    ) : <React.Fragment key={`map-card-${index}`} />
                );
            })}
        </>
    );
}

export default Lists;