import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import { useState, useEffect, useRef } from "react";
import { loginWithEmail, loginWithGitHub } from "../utils/login.tsx";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Card from "@mui/joy/Card";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "@mui/joy/Input";
import Snackbar from "@mui/joy/Snackbar";
import Link from "@mui/joy/Link";
import { GetLoggedIn, query } from "components/utils";
import { AppBar } from "components";
import { usable } from "../utils/contents.ts";
import { GithubIcon } from "components/assets";

function Login() {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerHeight);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [searchParams, _] = useSearchParams();
    const redirectURL = searchParams.get("redirectURL") || "/";
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const currentScale1 = Math.min(1, (windowHeight - 64) / 570);
    const currentScale2 = Math.min(1, windowWidth / 480);
    const currentScale = Math.min(currentScale1, currentScale2);
    const handleEmailLogin = async () => {
        if (email === "") {
            setError1(true);
        }
        if (password === "") {
            setError2(true);
        }
        if (email !== "" && password !== "") {
            const { data, error } = await loginWithEmail(email, password);
            if (!error && data?.user) {
                navigate(redirectURL);
            } else {
                setOpenSnackbar(true);
            }
        }
    };
    const redirectRef = useRef(redirectURL);
    useEffect(() => {
        const checkLoggedUser = async () => {
            if (await GetLoggedIn()) {
                navigate(redirectRef.current);
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
            <AppBar
                link={[["Log In", "/#/login/"]]}
                list={[
                    ["컨텐츠", usable.map(([id, name]) => [name, `/${id}/`])],
                    [
                        "공통 기능",
                        [
                            ["Sign Up", "q:/#/signup/"],
                            ["Log In", "q:/#/login/"]
                        ]
                    ]
                ]}
            />
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
                        aspectRatio: "398.667 / 545.479",
                        maxWidth: 400,
                        p: 4,
                        borderRadius: "xl",
                        boxShadow: "md",
                        borderColor: "neutral.outlinedBorder",
                        transform: `scale(${currentScale})`,
                        transformOrigin: "center",
                        transition: "transform 0s ease-out",
                        flexShrink: 0
                    }}
                >
                    <Typography
                        level="h2"
                        component="h1"
                        textAlign="center"
                        sx={{ mb: 4, fontWeight: "xl", color: "text.primary" }}
                    >
                        Log In
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <FormControl error={error1}>
                            <Input
                                type="email"
                                placeholder="Email"
                                variant="outlined"
                                size="md"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setError1(false);
                                }}
                                sx={{ borderRadius: "md" }}
                            />
                            <FormHelperText>
                                {error1 ? "Please enter your email address." : "\u00A0"}
                            </FormHelperText>
                        </FormControl>
                        <FormControl error={error2}>
                            <Input
                                type="password"
                                placeholder="Password"
                                variant="outlined"
                                size="md"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError2(false);
                                }}
                                sx={{ borderRadius: "md" }}
                            />
                            <FormHelperText>
                                {error2 ? "Please enter your password." : "\u00A0"}
                            </FormHelperText>
                        </FormControl>
                        <Button
                            variant="solid"
                            color="primary"
                            size="md"
                            onClick={handleEmailLogin}
                            sx={{ borderRadius: "md", mt: 1, fontWeight: "md" }}
                        >
                            Log In
                        </Button>
                        <Typography level="title-sm">
                            Don't have an account?{" "}
                            <Link component="a" href={"/#/signup" + query}>
                                Sign Up
                            </Link>
                        </Typography>
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
                                backgroundColor: "#1b1f23"
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
                onClose={() => {
                    setOpenSnackbar(false);
                }}
                color="danger"
                variant="outlined"
                autoHideDuration={2000}
            >
                Log In Failed.
            </Snackbar>
        </>
    );
}

export default Login;