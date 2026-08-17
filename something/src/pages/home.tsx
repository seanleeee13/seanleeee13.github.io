import Typography from "@mui/joy/Typography";
import MenuIcon from "../assets/menu.tsx";
import ReactLogoIcon from "../assets/react_logo.tsx";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import { keyframes } from "@emotion/react";
import IconButton from "@mui/joy/IconButton";
import Button from "@mui/joy/Button";
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import backgroundImage from "../assets/bg.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase_key.tsx";
import Divider from "@mui/joy/Divider";

function Home() {
    const [open, setOpen] = useState<boolean>(false);
    const fadeIn = keyframes`
        from { opacity: 0; scale: 0 }
        to { opacity: 1; scale: 1 }
    `;
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
        <Box
            sx={{
                backgroundImage: `url("${backgroundImage}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
                width: "100vw",
            }}
        >
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
                                        href="/something/"
                                    >
                                        Home
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton
                                        component="a"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                        href="/something/#/play/"
                                    >
                                        Play
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <ReactLogoIcon />
                    </IconButton>
                    <Divider orientation="vertical" />
                    <Button variant="plain" color="neutral" component="a" href="/something/">
                        Something
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
            <Stack
                sx={{
                    p: 4,
                    mx: "auto",
                    my: 5,
                    maxWidth: 1000,
                    marginTop: "8vw",
                }}
                spacing={3}
            >
                <Box
                    sx={{
                        width: "fit-content",
                    }}
                >
                    <Typography
                        level="h1"
                        textColor="common.white"
                        sx={{
                            animation: `${fadeIn} 0.5s ease-out forwards`,
                        }}
                    >
                        SOMETHING
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: "fit-content",
                    }}
                >
                    <Typography
                        level="h3"
                        textColor="common.white"
                        sx={{
                            animation: `${fadeIn} 0.5s ease-out forwards`,
                        }}
                    >
                        Play Chess with Something AI
                    </Typography>
                </Box>
                <Box>
                    <Button
                        component="a"
                        variant="plain"
                        href="/something/#/play/"
                        size="lg"
                        sx={{
                            backgroundColor: "common.white",
                            color: "neutral.800",
                            transition: "all 0.4s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                                backgroundColor: "neutral.100",
                            },
                            animation: `${fadeIn} 0.5s ease-out forwards`,
                        }}
                    >
                        Play
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}

export default Home;