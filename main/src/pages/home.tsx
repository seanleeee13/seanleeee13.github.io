import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import MenuIcon from "../assets/menu.tsx";
import GFFIcon from "../assets/gff.tsx";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import React, { useState, useEffect } from "react";
import { supabase, type UserInterface } from "../utils/supabase_key.tsx";
import Divider from "@mui/joy/Divider";
import { ListItem, type ColorPaletteProp } from "@mui/joy";
import Chip from "@mui/joy/Chip";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";

function MyPage() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserInterface>();
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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
            } catch (err) {
                console.error("Error while loading list data: ", err);
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
    if (users && (users.name === "" || users.name === null)) {
        const handleSaveNickname = async () => {
            const targetNickname = value.trim();
            if (targetNickname.length < 5 || 20 < targetNickname.length) {
                setError(true);
                setErrorMessage("이름은 5글자 이상 20글자 이하여야 합니다.");
                return;
            }
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                return;
            }
            const { error } = await supabase
                .from("user")
                .update({ name: targetNickname })
                .eq("id", session.user.id);
            if (error) {
                console.error("Nickname Save Fail", error.message);
                setError(true);
                setErrorMessage("닉네임 저장 중 오류가 발생했습니다.");
                return;
            }
            window.location.reload();
        };
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
                <Stack direction="column" spacing={4} sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}>
                    <Typography level="h1">마지막입니다. 어떻게 불러드릴까요?</Typography>
                    <Stack direction="column" spacing={4} sx={{ p: 4, mx: "auto", my: 5, maxWidth: 350 }}>
                        <FormControl error={error}>
                            <Input
                                variant="outlined" color="primary" size="lg" placeholder="이름" value={value}
                                onChange={(event) => {
                                    const data = event.target.value.trim();
                                    setValue(data);
                                    if (data.length < 5 || 20 < data.length) {
                                        setError(true);
                                        setErrorMessage("이름은 5글자 이상 20글자 이하여야 합니다.");
                                    } else {
                                        setError(false);
                                        setErrorMessage("");
                                    }
                                }}
                            />
                            <FormHelperText>{errorMessage}</FormHelperText>
                        </FormControl>
                        <Button
                            variant="solid" color="primary" disabled={error} size="lg" onClick={handleSaveNickname}
                        >제출</Button>
                    </Stack>
                </Stack>
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
                            <List>
                                {users?.role.map((text) => <ListItemButton component="a" onClick={() => {setOpen(false)}} href={`/${text[0]}/`} key={`listitembutton-${text[0]}`}>{text[1]}</ListItemButton>)}
                            </List>
                            <Divider />
                            <List>
                                <ListItem>
                                    공통 기능
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
                <Typography level="h1">환영합니다, {users?.name}님!</Typography>
                <Typography level="body-xs">로그인은 영어인데 갑자기 한국어로 변하면 좀 그런가...</Typography>
                <Stack direction="row" spacing={1}><Typography level="h3">가진 권한: {users?.role.length === 0 ? "없음" : ""}</Typography>{users?.role.map((text) => <React.Fragment key={`chip1-${text[0]}`}><Chip size="md" variant="soft" color={colormap[text[0]]} slotProps={{ action: { component: 'a', href: `/${text[0]}/` } }}>{text[1]}</Chip></React.Fragment>)}</Stack>
                <Stack direction="row" spacing={1}><Typography level="h3">가진 보기 권한: {users?.vrole.length === 0 ? "없음" : ""}</Typography>{users?.vrole.map((text) => <React.Fragment key={`chip2-${text[0]}`}><Chip size="md" variant="soft" color={colormap[text[0]]} slotProps={{ action: { component: 'a', href: `/${text[0]}/` } }}>{text[1]}</Chip></React.Fragment>)}</Stack>
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