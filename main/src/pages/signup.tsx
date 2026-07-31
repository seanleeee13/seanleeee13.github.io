import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import MenuIcon from "../assets/menu";
import GFFIcon from "../assets/gff";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase_key";
import { signUpWithEmail, loginWithGitHub } from "../utils/login.tsx";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Card from "@mui/joy/Card";
import { useNavigate, useSearchParams } from "react-router-dom";
import GithubIcon from "../assets/github.tsx";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Snackbar from "@mui/joy/Snackbar";

function getQueryURL(link: string) {
    return `${link}${window.location.hash.includes("?") ? "?" + window.location.hash.split("?")[1] : window.location.search === "" || window.location.search === "?" ? "/" : window.location.search}`;
}

function SignUp() {
    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerHeight);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [error4, setError4] = useState(false);
    const [error5, setError5] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const redirectURL = searchParams.get("redirectURL") || "/";
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const currentScale1 = Math.min(1, (windowHeight - 64) / 620);
    const currentScale2 = Math.min(1, windowWidth / 480);
    const currentScale = Math.min(currentScale1, currentScale2);
    const handleEmailSignUp = async () => {
        if (email === "") {
            setError1(true);
        }
        if (password === "") {
            setError2(true);
        }
        if (confirmPassword === "") {
            setError3(true);
        }
        if (password !== confirmPassword) {
            setError4(true);
            return;
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
        if (password.length < 6 || !passwordRegex.test(password)) {
            setError5(true);
            return;
        }
        if (email !== "" && password !== "") {
            const { data, error } = await signUpWithEmail(email, password);
            console.log(data, error);
            if (!error && data?.user) {
                navigate(redirectURL);
            } else {
                setOpenSnackbar(true);
            }
        }
    };
    useEffect(() => {
        const checkLoggedUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate(redirectURL);
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
                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href={getQueryURL("/#/login")}>
                                    Log In
                                </ListItemButton>
                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href={getQueryURL("/#/signup")}>
                                    Sign Up
                                </ListItemButton>
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <GFFIcon />
                    </IconButton>
                    <Button variant="plain" color="neutral" component="a" href={getQueryURL("/#/signup")}>Sign Up</Button>
                </Stack>
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={2}
                    sx={{width: "100%"}}
                >
                    <Button variant="solid" color="neutral" component="a" href={getQueryURL("/#/signup")}>Sign Up</Button>
                    <Button variant="outlined" color="neutral" component="a" href={getQueryURL("/#/login")}>Log In</Button>
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
                        aspectRatio: "398.667 / 591",
                        maxWidth: 400,
                        p: 4,
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
                        level="h2"
                        component="h1"
                        textAlign="center"
                        sx={{ mb: 4, fontWeight: "xl", color: "text.primary" }}
                    >
                        Sign Up
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <FormControl error={error1}>
                            <Input
                                type="email"
                                placeholder="Email"
                                variant="outlined"
                                size="md"
                                value={email}
                                onChange={(event) => {setEmail(event.target.value); setError1(false)}}
                                sx={{ borderRadius: "md" }}
                            />
                            <FormHelperText>
                                {error1 ? "Please enter your email address." : "\u00A0"}
                            </FormHelperText>
                        </FormControl>
                        <FormControl error={error2 || error4 || error5}>
                            <Input
                                type="password"
                                placeholder="Password"
                                variant="outlined"
                                size="md"
                                value={password}
                                onChange={(event) => {setPassword(event.target.value); setError2(false); setError4(false); setError5(false)}}
                                sx={{ borderRadius: "md" }}
                            />
                            <FormHelperText>
                                {error2 ? "Please enter your password." : error4 ? "Passwords do not match. Please check again." : error5 ? "Password must be at least 6 characters and contain both letters and numbers." : "\u00A0"}
                            </FormHelperText>
                        </FormControl>
                        <FormControl error={error3 || error4 || error5}>
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                variant="outlined"
                                size="md"
                                value={confirmPassword}
                                onChange={(event) => {setConfirmPassword(event.target.value); setError3(false); setError4(false); setError5(false)}}
                                sx={{ borderRadius: "md" }}
                            />
                            <FormHelperText>
                                {error3 ? "Please enter your password." : error4 ? "Passwords do not match. Please check again." : error5 ? "" : "\u00A0"}
                            </FormHelperText>
                        </FormControl>
                        <Button
                            variant="solid"
                            color="primary"
                            size="md"
                            onClick={handleEmailSignUp}
                            sx={{ borderRadius: "md", mt: 1, fontWeight: "md" }}
                        >
                            Sign Up
                        </Button>
                        <Typography level="title-sm">Already have an account? <Link component="a" href={getQueryURL("/#/login")}>Log In</Link></Typography>
                    </Box>
                    <Divider sx={{ my: 3, textTransform: "lowercase", color: "text.tertiary" }}>
                        or
                    </Divider>
                    <Button
                        variant="outlined"
                        color="neutral"
                        size="md"
                        startDecorator={<GithubIcon />}
                        onClick={() => loginWithGitHub(redirectURL)}
                        sx={{
                            borderRadius: "md",
                            fontWeight: "md",
                            backgroundColor: "#24292e",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#1b1f23",
                            },
                            "& svg": {
                                color: "#ffffff !important",
                                fill: "#ffffff !important"
                            }
                        }}
                    >
                        Continue with Github
                    </Button>
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
                Sign Up Failed.
            </Snackbar>
        </>
    );
}

export default SignUp;