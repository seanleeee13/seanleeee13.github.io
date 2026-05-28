import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import accordionSummaryClasses from "@mui/joy/AccordionSummary/accordionSummaryClasses";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Typography from "@mui/joy/Typography";
import ExpandMoreIcon from "../assets/expand_more";
import MenuIcon from "../assets/menu";
import GFFIcon from "../assets/gff";
import Link from "@mui/joy/Link";
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
import CircularProgress from "@mui/joy/CircularProgress";
import DialogTitle from "@mui/joy/DialogTitle";
import React, { useState, useEffect } from "react";
import { supabase, type ListInterface, type PListInterface } from "../supabase_key";

function Home() {
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const [listResult, plistResult] = await Promise.all([
                    supabase.from("list").select("*").order("parent"),
                    supabase.from("plist").select("*")
                ]);
                if (listResult.error) {
                    throw listResult.error;
                }
                if (plistResult.error) {
                    throw plistResult.error;
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
                            <Box sx={{fontSize: "xl"}}>
                                <GFFIcon />
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
                                                <ListItemButton component="a" href={"#/lists/" + text_data[0]}>{text_data[1]}</ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                    {index < data.length - 1 && (
                                        <Divider />
                                    )}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <GFFIcon />
                    </IconButton>
                    <Button variant="plain" color="neutral" component="a" href="/">Main</Button>
                </Stack>
            </Sheet>
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                <Typography level="h1">Geometry Dash Friend Forum / GFF</Typography>
                <Typography level="h3">1. 리스트 목록</Typography>
                <AccordionGroup sx={{
                    maxWidth: 400,
                    [`& .${accordionSummaryClasses.indicator}`]: {
                        transition: "0.2s",
                    },
                    [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                        transform: "rotate(180deg)",
                    }
                }} color="primary" variant="outlined">
                    {data.map((text) => (
                        <Accordion key={`map-group-${text}`}>
                            <AccordionSummary indicator={<ExpandMoreIcon />}>
                                <Typography component="span">{text[0][1]} / {text[0][0]}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {text.slice(1).map((text_data) => (
                                    <Link href={"#/lists/" + text_data[0]} key={`map-map-group-${text_data}`}>{text_data[1]} / {text_data[0]}</Link>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionGroup>
                <Typography level="h3">2. 참여자 목록</Typography>
                <Typography level="title-md">이 프로젝트에는 이슬우, 정민준, 최윤호, 박서후, 정하민이 참가하였습니다.</Typography>
            </Stack>
        </>
    );
}

export default Home;