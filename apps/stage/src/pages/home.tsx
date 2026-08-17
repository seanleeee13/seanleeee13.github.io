import Typography from "@mui/joy/Typography";
import MenuIcon from "../assets/menu.tsx";
import ReactLogoIcon from "../assets/react_logo.tsx";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Button from "@mui/joy/Button";
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase_key.tsx";
import Divider from "@mui/joy/Divider";
import bannerImage from "../assets/banner.png";
import Link from "@mui/joy/Link";

function Home() {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const checkLoggedUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
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
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                    <IconButton
                        variant="outlined"
                        color="neutral"
                        size="md"
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer open={open} onClose={() => setOpen(false)} size="sm">
                        <ModalClose />
                        <DialogTitle>
                            <Box>
                                <IconButton
                                    sx={{
                                        width: "35px",
                                        height: "35px",
                                        "& svg": {
                                            fontSize: "30px",
                                        },
                                    }}
                                    component="a"
                                    href="/"
                                >
                                    <ReactLogoIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <br />
                        <Box role="presentation" sx={{ p: 1 }}>
                            <List>
                                <ListItem>
                                    <Typography sx={{ fontWeight: "lg" }}>기본 기능</Typography>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton
                                        component="a"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                        href="/stage/"
                                    >
                                        Home
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <ReactLogoIcon />
                    </IconButton>
                    <Divider orientation="vertical" />
                    <Button variant="plain" color="neutral" component="a" href="/stage/">
                        Stage
                    </Button>
                </Stack>
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: "100%" }}
                >
                    {hasSession ? (
                        <Button variant="plain" color="neutral" component="a" href="/#/logout/">
                            Log Out
                        </Button>
                    ) : (
                        <>
                            <Button variant="solid" color="neutral" component="a" href="/#/signup/">
                                Sign Up
                            </Button>
                            <Button
                                variant="outlined"
                                color="neutral"
                                component="a"
                                href="/#/login/"
                            >
                                Log In
                            </Button>
                        </>
                    )}
                </Stack>
            </Sheet>
            <Stack sx={{ p: 4, mx: "auto", alignItems: "center" }} spacing={4}>
                <Link
                    href="/stage/"
                    sx={{
                        backgroundImage: `url("${bannerImage}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "70vw",
                        aspectRatio: "3 / 1",
                        display: "block",
                        "&:hover": { textDecoration: "none" },
                    }}
                />
                <Stack spacing={1} direction="row" width="70vw">
                    <Stack
                        direction="column"
                        spacing={1}
                        divider={<Divider />}
                        width="64px"
                        border="1.5px solid"
                    >
                        와! 카페
                    </Stack>
                    <Stack
                        sx={{
                            alignItems: "center",
                            border: "1.5px solid",
                            borderColor: "black",
                            borderRadius: "sm",
                            p: 6,
                        }}
                        spacing={3}
                    >
                        <Typography level="h3">프로젝트 108</Typography>
                        <Box sx={{ alignItems: "center" }}>
                            <Typography level="title-md">
                                이 프로젝트는 이해하기 어렵고 복잡한 과학 이론과 그 역사를 쉽고
                                재미있게 소개하는 프로젝트입니다.
                            </Typography>
                            <Typography level="title-md">
                                여러가지 창작물을 통해 과학 개념을 새로운 방식으로 보여주고 과학을
                                더욱 친근하게 전달해 줍니다.
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
}

export default Home;