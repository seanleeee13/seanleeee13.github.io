import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { keyframes } from "@emotion/react";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import backgroundImage from "../assets/bg.png";
import { AppBar } from "components";

function Home() {
    const fadeIn = keyframes`
        from { opacity: 0; scale: 0 }
        to { opacity: 1; scale: 1 }
    `;
    return (
        <>
            <AppBar
                link={[["Something", "/something/"]]}
                list={[
                    [
                        "Something",
                        [
                            ["Main", "/something/"],
                            ["Play", "/something/#/play/"],
                            ["Explore", "/something/#/explore/"]
                        ]
                    ]
                ]}
                content={["Something", "/something/"]}
            />
            <Box
                sx={{
                    backgroundImage: {
                        md: `linear-gradient(to right, black 40%, transparent 80%), url("${backgroundImage}")`,
                        sm: `linear-gradient(to bottom, black 60%, transparent 100%), url("${backgroundImage}")`
                    },
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    zIndex: -1000
                }}
            />
            <Box sx={{ overflowY: "auto", height: "calc(100vh - 64px)" }}>
                <Stack
                    sx={{
                        p: 4,
                        mx: "auto",
                        my: 5,
                        maxWidth: 1000,
                        marginTop: "8vw"
                    }}
                    spacing={3}
                >
                    <Box
                        sx={{
                            width: "fit-content"
                        }}
                    >
                        <Typography
                            level="h1"
                            textColor="common.white"
                            sx={{
                                animation: `${fadeIn} 0.5s ease-out forwards`
                            }}
                        >
                            SOMETHING
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: "fit-content"
                        }}
                    >
                        <Typography
                            level="h3"
                            textColor="common.white"
                            sx={{
                                animation: `${fadeIn} 0.5s ease-out forwards`
                            }}
                        >
                            Play Chess with Something AI
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button
                            component="a"
                            variant="solid"
                            href="/something/#/play/"
                            size="lg"
                            sx={{
                                backgroundColor: "common.white",
                                color: "common.black",
                                transition: "all 0.4s ease",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                    backgroundColor: "common.white"
                                },
                                animation: `${fadeIn} 0.5s ease-out forwards`
                            }}
                        >
                            Play
                        </Button>
                        <Button
                            component="a"
                            variant="outlined"
                            href="/something/#/explore/"
                            size="lg"
                            sx={{
                                color: "common.white",
                                transition: "all 0.4s ease",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                    backgroundColor: "transparent"
                                },
                                animation: `${fadeIn} 0.5s ease-out forwards`,
                                outline: "1px solid white",
                                outlineOffset: "-1px",
                                backgroundColor: "transparent"
                            }}
                        >
                            Explore
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default Home;