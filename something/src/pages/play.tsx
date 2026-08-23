import Typography from "@mui/joy/Typography";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import Divider from "@mui/joy/Divider";
import Radio from "@mui/joy/Radio";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import RadioGroup from "@mui/joy/RadioGroup";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import backgroundImage from "../assets/bg.png";
import { AppBar } from "components";

function PlaySelect() {
    const [color, setColor] = useState("random");
    const [p1, setP1] = useState("player");
    const [p2, setP2] = useState("greedytree.evaluator-5");
    const [_, setSearchParams] = useSearchParams();
    const handlePlay = () => {
        if (color === "" || p1 === "" || p2 === "") {
            return;
        }
        if (color === "random") {
            const isPlayerWhite = Math.random() < 0.5;
            if (isPlayerWhite) {
                setSearchParams({ white: p1, black: p2 });
            } else {
                setSearchParams({ white: p2, black: p1 });
            }
        } else {
            setSearchParams({ white: p1, black: p2 });
        }
    };
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
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                <Typography level="h1">PLAY</Typography>
                <FormControl>
                    <FormLabel>Color</FormLabel>
                    <RadioGroup
                        value={color}
                        onChange={(event) => {
                            setColor(event.target.value);
                        }}
                    >
                        <Radio value="random" label="Random" variant="outlined" />
                        <Radio value="select" label="Select" variant="outlined" />
                    </RadioGroup>
                </FormControl>
                <Stack spacing={1} direction="column">
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Typography level="title-md">
                            {color == "random" ? "P1:" : "White:"}
                        </Typography>
                        <Select
                            value={p1}
                            size="sm"
                            onChange={(__, newValue) => {
                                setP1(newValue === null ? "" : newValue);
                            }}
                        >
                            <Option value="player">Player</Option>
                            <Option value="something.ai-v4">Something.AI-v4</Option>
                            <Option value="greedytree.evaluator-5">GreedyTree.Evaluator-5</Option>
                        </Select>
                    </Stack>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Typography level="title-md">
                            {color == "random" ? "P2:" : "Black:"}
                        </Typography>
                        <Select
                            value={p2}
                            size="sm"
                            onChange={(__, newValue) => {
                                setP2(newValue === null ? "" : newValue);
                            }}
                        >
                            <Option value="player">Player</Option>
                            <Option value="something.ai-v4">Something.AI-v4</Option>
                            <Option value="greedytree.evaluator-5">GreedyTree.Evaluator-5</Option>
                        </Select>
                    </Stack>
                </Stack>
                <Button sx={{ maxWidth: "10%" }} onClick={handlePlay}>
                    Play
                </Button>
            </Stack>
        </Box>
    );
}

function PlayChess() {
    const [searchParams, _] = useSearchParams();
    const white = searchParams.get("white");
    const black = searchParams.get("black");
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
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                <Typography level="h1">PLAY</Typography>
            </Stack>
        </Box>
    );
}

function Play() {
    const [searchParams, _] = useSearchParams();
    const white = searchParams.get("white");
    const black = searchParams.get("black");
    if (white === null || black === null) {
        return <PlaySelect />;
    } else {
        return <PlayChess />;
    }
}

export default Play;