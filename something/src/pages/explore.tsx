import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { AppBar } from "components";
import { Box, Button, Card, Divider, Tooltip } from "@mui/joy";
import { AIDataList } from "../utils/ai";
import { useNavigate } from "react-router-dom";

function Explore() {
    const navigate = useNavigate();
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
            <Box sx={{ overflowY: "auto", height: "calc(100vh - 64px)", scrollbarGutter: "stable both-edges" }}>
                <Stack
                    sx={{
                        px: 4,
                        py: 2,
                        mx: "auto",
                        my: 5,
                        maxWidth: 1000,
                        marginTop: "8vw"
                    }}
                    spacing={5}
                >
                    <Typography level="h1" textColor="common.white">
                        Explore AIs
                    </Typography>
                    <Stack
                        sx={{
                            overflowX: "auto",
                            overflowY: "visible",
                            py: "12px",
                            pl: "12px",
                            mt: "28px !important",
                            width: "100%",
                            scrollbarGutter: "stable"
                        }}
                        direction="row"
                        spacing={2}
                    >
                        {AIDataList.map((data) => (
                            <Card
                                onClick={() => {
                                    if (Math.random() < 0.5) {
                                        navigate(`/play?white=player&black=${data.id}`);
                                    } else {
                                        navigate(`/play?white=${data.id}&black=player`);
                                    }
                                }}
                                sx={{
                                    aspectRatio: "2 / 3",
                                    height: "350px",
                                    py: 3,
                                    transition: "transform 0.3s ease",
                                    cursor: "pointer",
                                    "&:hover": {
                                        transform: "scale(1.05)"
                                    }
                                }}
                                key={`card-${data.name}`}
                            >
                                <Stack direction="column" alignItems="center" spacing={2}>
                                    <Stack direction="column" alignItems="center" spacing={1}>
                                        <Typography level="h2">{data.name}</Typography>
                                        <Typography level="title-lg">
                                            by {
                                                data.developer.length > 1
                                                ? <>
                                                    {`${data.developer[0]} and `}
                                                    <Tooltip title={data.developer.slice(1).join(", ")} arrow>
                                                        <Typography sx={{ textDecoration: "underline" }}>
                                                            more
                                                        </Typography>
                                                    </Tooltip>
                                                </>
                                                : data.developer[0]
                                            }
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <Typography level="title-sm">{data.description}</Typography>
                                    <Divider />
                                    <Stack
                                        direction="column"
                                        alignItems="center"
                                        spacing={0.5}
                                        sx={{
                                            "& span": {
                                                color: "var(--joy-palette-neutral-600)"
                                            }
                                        }}
                                    >
                                        <Typography level="title-sm">
                                            Version: <span>{data.version}</span>
                                        </Typography>
                                        <Typography level="title-sm">
                                            Algorithm: <span>{data.algorithm}</span>
                                        </Typography>
                                        <Typography level="title-sm">
                                            Depth: <span>{data.depth} moves</span>
                                        </Typography>
                                        <Typography level="title-sm">
                                            Elo Rating: <span>{data.elo}</span>
                                        </Typography>
                                    </Stack>
                                    <Button>Play</Button>
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default Explore;