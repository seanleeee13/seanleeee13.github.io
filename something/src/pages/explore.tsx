import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import { AppBar } from "components";
import { Box } from "@mui/joy";

function Explore() {
    return (
        <>
            <AppBar
                link={[
                    ["Something", "/something/"],
                    ["Explore", "/something/#/explore"]
                ]}
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
                    backgroundColor: "black",
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    zIndex: -1000
                }}
            />
            <Box sx={{ overflowY: "auto", height: "calc(100vh - 64px)" }}>
                <Stack
                    sx={{
                        px: 4,
                        py: 2,
                        mx: "auto",
                        my: 5,
                        maxWidth: 1000,
                        marginTop: "8vw"
                    }}
                    spacing={3}
                >
                    <Typography level="h1" textColor="common.white">
                        Explore AIs (제작중)
                    </Typography>
                </Stack>
            </Box>
        </>
    );
}

export default Explore;