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
            <AppBar
                link={[["Something", "/something/"]]} 
                list={[["Something", [["Main", "/something/"], ["Play", "/something/#/play/"]]]]}
            />
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