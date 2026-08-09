import { createHashRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/home.tsx";
import Typography from "@mui/joy/Typography";
import MenuIcon from "./assets/menu.tsx";
import ReactLogoIcon from "./assets/react_logo.tsx";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import FormControl from "@mui/joy/FormControl"
import FormHelperText from "@mui/joy/FormHelperText"
import Input from "@mui/joy/Input"
import Button from "@mui/joy/Button"
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import Card from "@mui/joy/Card";
import Snackbar from "@mui/joy/Snackbar";
import { supabase } from "./utils/supabase_key.tsx";
import Divider from "@mui/joy/Divider";

const router = createHashRouter([
    { path: "/", element: <Home /> },
]);

function Authenticate() {
    const [open, setOpen] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerHeight);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const currentScale1 = Math.min(1, (windowHeight - 64) / 400);
    const currentScale2 = Math.min(1, windowWidth / 480);
    const currentScale = Math.min(currentScale1, currentScale2);
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
    }, []);
    const handlePasswordSubmit = async () => {
        if (password.trim() === "") {
            setError(true);
        } else {
            const { data, error } = await supabase.rpc("check_password_stage", {
                password: password
            });
            if (!error && data === true) {
                localStorage.setItem("stage_page_unlocked", "true");
                window.location.reload();
            } else {
                setOpenSnackbar(true);
            }
        }
    };
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
                                    <ReactLogoIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <br />
                        <Box role="presentation" sx={{p: 1}}>
                            <List>
                                <ListItem>
                                    <Typography sx={{fontWeight: "lg"}}>기본 기능</Typography>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href="/something/">
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
                    <Button variant="plain" color="neutral" component="a" href="/stage/">Stage</Button>
                </Stack>
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={1}
                    sx={{width: "100%"}}
                >
                    {
                        hasSession ?
                        <Button variant="plain" color="neutral" component="a" href="/#/logout/">Log Out</Button> :
                        <>
                            <Button variant="solid" color="neutral" component="a" href="/#/signup/">Sign Up</Button>
                            <Button variant="outlined" color="neutral" component="a" href="/#/login/">Log In</Button>
                        </>
                    }
                </Stack>
            </Sheet>
            <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                    width: "100%",
                    height: "calc(100dvh - 64px)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    px: 0
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        aspectRatio: "398.667 / 326",
                        maxWidth: 400,
                        p: 6,
                        borderRadius: "xl",
                        boxShadow: "md",
                        borderColor: "neutral.outlinedBorder",
                        transform: `scale(${currentScale})`, 
                        transformOrigin: "center",
                        transition: "transform 0.1s ease-out",
                        flexShrink: 0
                    }}
                >
                    <Typography
                        level="h1"
                        component="h1"
                        textAlign="center"
                        sx={{ mb: 4, fontWeight: "xl", color: "text.primary" }}
                    >
                        비밀번호 입력
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <FormControl error={error}>
                            <Input
                                type="password"
                                placeholder="Password"
                                variant="outlined"
                                size="lg"
                                value={password}
                                onChange={(event) => {setPassword(event.target.value); setError(false)}}
                                sx={{ borderRadius: "lg" }}
                            />
                            <FormHelperText>
                                {error ? "비밀번호를 입력해 주세요." : "\u00A0"}
                            </FormHelperText>
                        </FormControl>
                        <Button
                            variant="solid"
                            color="primary"
                            size="lg"
                            onClick={handlePasswordSubmit}
                            sx={{ borderRadius: "lg", mt: 1, fontWeight: "md" }}
                        >
                            제출
                        </Button>
                    </Box>
                </Card>
            </Stack>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={openSnackbar}
                onClose={() => {setOpenSnackbar(false)}}
                color="danger"
                variant="outlined"
                autoHideDuration={2000}
            >
                Log In Failed.
            </Snackbar>
        </>
    );
}

function Router() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        const isUnlocked = localStorage.getItem("stage_page_unlocked") === "true";
        if (isUnlocked) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);
    if (loading) {
        return null;
    }
    if (!isAuthenticated) {
        return <Authenticate />
    }
    return (
        <RouterProvider router={router} />
    );
}

export default Router;