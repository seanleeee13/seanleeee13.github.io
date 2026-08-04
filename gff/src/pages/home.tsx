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
import { supabase, type ListInterface, type PListInterface } from "../utils/supabase_key";

function Home() {
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const [listResult, plistResult] = await Promise.all([
                    supabase.from("list").select("*").order("id"),
                    supabase.from("plist").select("*").order("id")
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
                    <Button variant="plain" color="neutral" component="a" href="/gff/">GFF</Button>
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
                                    <Link href={"/gff/#/lists/" + text_data[0]} key={`map-map-group-${text_data}`}>
                                        {text_data[1]} / {text_data[0]}
                                    </Link>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionGroup>
                <Typography level="h3">2. 모든 기능</Typography>
                <Stack direction="row" spacing={1}>
                    <Button component="a" href="/gff/#/lists" variant="outlined">리스트 목록</Button>
                    <Button component="a" href="/gff/#/levels" variant="outlined">레벨 검색하기</Button>
                </Stack>
                <Typography level="h3">3. 참여자 목록</Typography>
                <Typography level="title-md">이 프로젝트에는 seanleeee13, problem73481, yunho0927, glowingberri가 참가하였습니다.</Typography>
                <Typography level="h3">4. 기존 참여자에게의 안내</Typography>
                <Typography level="title-md">1. 현재 대규모 업데이트 중이라서 회원 가입을 한 뒤 권한을 받고 나서 레벨을 볼 수 있습니다. 번거롭더라도 아래의 회원 가입 버튼을 눌러 회원 가입을 해 주시면, 8월 2일 (일) 에 한번에 권한을 적용해드리겠습니다.</Typography>
                <Button variant="solid" color="primary" component="a" href="/#/signup/">Sign Up</Button>
                <Typography level="title-md">2. 8월 2일 (일) 쯤에 아마 GFF를 수정할 수 있게 업데이트를 할 예정입니다. 그 이후로는 다음과 같은 경우 그에 따른 처벌이 주어집니다.</Typography>
                <AccordionGroup color="primary" variant="outlined">
                    <Accordion>
                        <AccordionSummary indicator={<ExpandMoreIcon />}>규정</AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1}>
                                <Typography level="title-sm">1. 과도하게 부적합한 난이도 투표를 한 경우 (벌점 1점)</Typography>
                                <Typography level="title-sm">2. 존재하지 않는 레벨이나 가짜 클리어자 정보를 업로드한 경우 (벌점 2점)</Typography>
                                <Typography level="title-sm">3. 1~2의 행위가 3회 이상 지속적으로 반복된 경우 (벌점 4점)</Typography>
                                <Typography level="title-sm">4. 1~2의 행위가 경고 문자 확인에도 불구하고 5회 이상 지속적으로 반복되거나 한 번에 많은 조작을 해서 바로잡기가 힘들게 된 경우 (벌점 7점)</Typography>
                                <Typography level="title-sm">벌점 1~2점: 경고 문자 및 이메일 발신</Typography>
                                <Typography level="title-sm">벌점 3점: 3일 간 GFF 차단</Typography>
                                <Typography level="title-sm">벌점 5점: 7일 간 GFF 차단</Typography>
                                <Typography level="title-sm">벌점 8점: 30일 간 GFF 차단</Typography>
                                <Typography level="title-sm">벌점 10점: 무기한 GFF 차단</Typography>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            </Stack>
        </>
    );
}

export default Home;