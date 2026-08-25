import { createHashRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/home.tsx";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Snackbar from "@mui/joy/Snackbar";
import { supabase } from "components/utils";
import { AppBar } from "components";

const router = createHashRouter([{ path: "/", element: <Home /> }]);

function Authenticate() {
    const [openSnackbar, setOpenSnackbar] = useState(false);
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
    const handlePasswordSubmit = async () => {
        if (password.trim() === "") {
            setError(true);
        } else {
            const { data, error: passwordError } = await supabase.rpc("check_password_stage", {
                password: password,
            });
            if (!passwordError && data === true) {
                localStorage.setItem("stage_page_unlocked", "true");
                window.location.reload();
            } else {
                setOpenSnackbar(true);
            }
        }
    };
    return (
        <>
            <AppBar
                link={[["Stage", "/stage/"]]} list={[["Stage", [["Main", "/stage/"]]]]}
                content={["Stage", "/stage/"]}
            />
            <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                    width: "100%",
                    height: "calc(100dvh - 64px)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    px: 0,
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
                        flexShrink: 0,
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
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError(false);
                                }}
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
        return <Authenticate />;
    }
    return <RouterProvider router={router} />;
}

export default Router;