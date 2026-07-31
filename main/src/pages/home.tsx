import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import MenuIcon from "../assets/menu.tsx";
import GFFIcon from "../assets/gff.tsx";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import React, { useState, useEffect } from "react";
import { supabase, type UserInterface } from "../utils/supabase_key.tsx";
import Divider from "@mui/joy/Divider";
import { type ColorPaletteProp } from "@mui/joy";
import Chip from "@mui/joy/Chip";
import { useNavigate } from "react-router-dom";
import Link from "@mui/joy/Link";

function MyPage() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserInterface>();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const userResult = await supabase.from("user").select("*").eq("id", session.user.id).single();
                    if (userResult.error) {
                        throw userResult.error;
                    }
                    if (userResult.data) {
                        setUsers(userResult.data as UserInterface);
                    }
                }
            } catch (error) {
                console.error("Error while loading list data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTableData();
    }, [navigate]);
    const colormap: Record<string, ColorPaletteProp> = {admin: "primary", gff: "warning"};
    if (loading) {
        return null;
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
                            <List>
                                {users?.role.map((text) => <ListItemButton component="a" onClick={() => {setOpen(false)}} href={`/${text[0]}/`} key={`listitembutton-${text[0]}`}>{text[1]}</ListItemButton>)}
                            </List>
                            <Divider />
                            <List>
                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href="/#/logout/">
                                    Log Out
                                </ListItemButton>
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <GFFIcon />
                    </IconButton>
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
            <Stack direction="column" spacing={3} sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}>
                <Typography level="h1">환영합니다!</Typography>
                <Typography level="body-xs">로그인은 영어인데 갑자기 한국어로 변하면 좀 그런가...</Typography>
                <Stack direction="row" spacing={1}><Typography level="h3">가진 권한: {users?.role.length === 0 ? "없음" : ""}</Typography>{users?.role.map((text) => <React.Fragment key={`chip-${text[0]}`}><Chip size="md" variant="soft" color={colormap[text[0]]} slotProps={{ action: { component: 'a', href: `/${text[0]}/` } }}>{text[1]}</Chip></React.Fragment>)}</Stack>
            </Stack>
        </>
    );
}

function IntroPage() {
    const [open, setOpen] = useState(false);
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
                            <List>
                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href="/#/login/">
                                    Log In
                                </ListItemButton>
                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href="/#/signup/">
                                    Sign Up
                                </ListItemButton>
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <GFFIcon />
                    </IconButton>
                </Stack>
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={2}
                    sx={{width: "100%"}}
                >
                    <Button variant="solid" color="neutral" component="a" href="/#/signup/">Sign Up</Button>
                    <Button variant="outlined" color="neutral" component="a" href="/#/login/">Log In</Button>
                </Stack>
            </Sheet>
            <Stack direction="column" spacing={3} sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}>
                <Typography level="h1">Seanleeee13 Github Pages</Typography>
                <Typography level="title-lg">대충 내가 하는 모든 것에 대한 웹 페이지</Typography>
                <Typography level="title-sm">제작: 당연히 Seanleeee13</Typography>
                <Link level="title-sm" component="a" href="/gff/">GFF 사이트가 이전되었습니다. GFF를 보려면 여기를 누르세요.</Link>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{width: "100%"}}
                >
                    <Button variant="solid" color="neutral" component="a" href="/#/signup/">Sign Up</Button>
                    <Button variant="outlined" color="neutral" component="a" href="/#/login/">Log In</Button>
                </Stack>
            </Stack>
        </>
    );
}

function Home() {
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const checkLoggedUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setHasSession(true);
            } else {
                setHasSession(false);
            }
            setLoading(false);
        };
        checkLoggedUser();
    }, [navigate]);
    if (loading) {
        return null;
    }
    return hasSession ? <MyPage /> : <IntroPage />;
}

export default Home;