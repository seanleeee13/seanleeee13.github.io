import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import IconButton from "@mui/joy/IconButton";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Link from "@mui/joy/Link";
import CircularProgress from "@mui/joy/CircularProgress";
import Grid from "@mui/joy/Grid";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import selectClasses from "@mui/joy/Select/selectClasses";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import React, { useState, useEffect } from "react";
import {
    supabase,
    type LevelInterface,
    type ListInterface,
    type PListInterface,
} from "components/utils";
import { cdavg, pdavg } from "../utils/calculate_difficulty_avg";
import { ExpandMoreIcon, FilterListIcon, SearchIcon } from "components/assets";
import { AppBar } from "components";

function LevelsMain() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortType, setSortType] = useState<
        "id" | "name" | "rating" | "featured" | "vote" | string
    >("id");
    const [sortAsc, setSortAsc] = React.useState<"asc" | "desc">("desc");
    const [searchData, setSearchData] = React.useState<string>("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const [levelResult, listResult, plistResult] = await Promise.all([
                    supabase.from("level").select("*").order("level_id", { ascending: false }),
                    supabase.from("list").select("*").order("id"),
                    supabase.from("plist").select("*").order("id"),
                ]);
                if (levelResult.error) {
                    throw levelResult.error;
                }
                if (listResult.error) {
                    throw listResult.error;
                }
                if (plistResult.error) {
                    throw plistResult.error;
                }
                if (levelResult.data) {
                    setLevels(levelResult.data as LevelInterface[]);
                }
                if (listResult.data) {
                    setLists(listResult.data as ListInterface[]);
                }
                if (plistResult.data) {
                    setPLists(plistResult.data as PListInterface[]);
                }
            } catch (error) {
                console.error("Error while loading list data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTableData();
    }, []);
    const ratio = dimensions.width / dimensions.height;
    let cardSize: { width: number | string; height: number | string; side: "row" | "column" } = {
        width: 0,
        height: 0,
        side: "row",
    };
    let fontSizeA: "h4" | "title-lg" | "title-md";
    let fontSizeB: "title-md" | "title-sm" | "body-lg";
    let fontSizeC: "body-sm" | "body-xs";
    if (ratio >= 2) {
        cardSize = { width: "40vw", height: 135, side: "row" };
    } else if (ratio >= 1.5) {
        cardSize = { width: "35vw", height: 135, side: "row" };
    } else if (ratio >= 1.0) {
        cardSize = { width: "62vw", height: 135, side: "row" };
    } else if (ratio >= 0.6) {
        cardSize = { width: "40vw", height: "auto", side: "column" };
    } else {
        cardSize = { width: "80vw", height: "auto", side: "column" };
    }
    if (dimensions.width >= 1118.4) {
        fontSizeA = "h4";
        fontSizeB = "title-sm";
        fontSizeC = "body-sm";
    } else if (dimensions.width >= 932) {
        fontSizeA = "h4";
        fontSizeB = "title-sm";
        fontSizeC = "body-xs";
    } else {
        fontSizeA = "h4";
        fontSizeB = "title-sm";
        fontSizeC = "body-xs";
    }
    if (loading) {
        return (
            <>
                <CircularProgress />
                <Typography level="h4">Loading...</Typography>
            </>
        );
    }
    let text_val;
    const data = [];
    let last_data = "";
    let target;
    for (let i = 0; i < lists.length; i++) {
        text_val = lists[i];
        if (last_data !== text_val.parent) {
            last_data = text_val.parent;
            target = plists.find((item) => item.name === last_data);
            data.push([[target?.name, target?.long_name]]);
        }
        data[data.length - 1].push([text_val.name, text_val.long_name]);
    }
    let sorted = levels
        .filter(
            (level) =>
                level.level_name.toLowerCase().includes(searchData.toLowerCase()) ||
                level.level_id === +searchData,
        )
        .toSorted((a, b) => {
            if (sortType === "id") {
                return a.level_id - b.level_id;
            } else if (sortType === "name") {
                return a.level_name.toLowerCase() > b.level_name.toLowerCase() ? 1 : -1;
            } else if (sortType === "rating") {
                const ad = cdavg(a.difficulty_votes) ?? [0, 0, 0, 0];
                const bd = cdavg(b.difficulty_votes) ?? [0, 0, 0, 0];
                if (ad[1] === 0 && bd[1] === 0) {
                    return 0;
                } else if (ad[1] === 0) {
                    return sortAsc === "asc" ? 1 : -1;
                } else if (bd[1] === 0) {
                    return sortAsc === "asc" ? -1 : 1;
                } else {
                    return 9 * ad[0] + ad[1] - 9 * bd[0] - bd[1];
                }
            } else if (sortType === "featured") {
                return (
                    (cdavg(a.difficulty_votes)?.[2] ?? 0) - (cdavg(b.difficulty_votes)?.[2] ?? 0)
                );
            } else if (sortType === "vote") {
                return (
                    Object.keys(a.difficulty_votes).length - Object.keys(b.difficulty_votes).length
                );
            }
            return 0;
        });
    if (sortAsc === "desc") {
        sorted = sorted.toReversed();
    }
    type MenuListType = [string, [string, string][]][];
    return (
        <>
            <AppBar
                link={[["GFF", "/gff/"]]}
                list={[...data.map((text) => [
                    text[0][1], text.slice(1).map(
                        (text_data) => [text_data[1], `/gff/#/lists/${text_data[0]}`]
                    )
                ]), ...[[
                    "GFF", [
                        ["리스트 목록", "/gff/#/lists/"],
                        ["레벨 검색하기", "/gff/#/levels/"],
                        ["레벨 업로드", "/gff/#/upload/"]
                    ]
                ]]] as MenuListType}
            />
            <Stack spacing={2} sx={{ pb: 7, pt: 5, px: "12.5%" }}>
                <Typography level="h3">레벨 검색</Typography>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ width: "fit-content", mx: "auto", justifyItems: "center" }}
                >
                    <Input
                        color="primary"
                        disabled={false}
                        placeholder="Search by level name or ID"
                        size="lg"
                        variant="outlined"
                        value={searchData}
                        onChange={(event) => {
                            setSearchData(event.target.value);
                        }}
                        startDecorator={
                            <IconButton
                                onClick={() => {
                                    setIsFilterOpen(!isFilterOpen);
                                }}
                            >
                                <FilterListIcon />
                            </IconButton>
                        }
                        sx={{ width: "75vw", "--Input-focusedThickness": "0rem" }}
                    />
                    <IconButton
                        variant="solid"
                        color="primary"
                        sx={{ width: "45px", height: "45px" }}
                    >
                        <SearchIcon />
                    </IconButton>
                </Stack>
                <AccordionGroup
                    transition={{
                        initial: "0.2s ease-out",
                        expanded: "0.2s ease",
                    }}
                    sx={{ width: "75vw", position: "relative", overflow: "hidden", p: 0 }}
                >
                    <Accordion
                        expanded={isFilterOpen}
                        sx={{ width: "100%", padding: 0, minHeight: 0 }}
                    >
                        <AccordionDetails sx={{ padding: 0 }}>
                            <Box sx={{ pb: 1.5, pt: 0.5 }}>
                                <Card sx={{ width: "100%" }}>
                                    <Stack spacing={2}>
                                        <Typography level="h4">필터</Typography>
                                        <Typography level="body-xs">나중에 할거임</Typography>
                                    </Stack>
                                </Card>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
                <Stack direction="row" spacing={1}>
                    <Select
                        startDecorator="Sort by: "
                        color="primary"
                        defaultValue="id"
                        indicator={<ExpandMoreIcon />}
                        value={sortType}
                        onChange={(_, value) => {
                            if (value) setSortType(value);
                        }}
                        sx={{
                            [`& .${selectClasses.indicator}`]: {
                                transition: "0.2s",
                                [`&.${selectClasses.expanded}`]: {
                                    transform: "rotate(-180deg)",
                                },
                            },
                        }}
                    >
                        <Option value="id">Level ID</Option>
                        <Option value="name">Name</Option>
                        <Option value="rating">Rating</Option>
                        <Option value="featured">Featured</Option>
                        <Option value="vote">Vote Count</Option>
                    </Select>
                    <ToggleButtonGroup
                        color="primary"
                        variant="outlined"
                        value={sortAsc}
                        onChange={(_, value) => {
                            if (value) setSortAsc(value);
                        }}
                    >
                        <Button value="asc">Asc</Button>
                        <Button value="desc">Desc</Button>
                    </ToggleButtonGroup>
                </Stack>
            </Stack>
            <Box sx={{ px: 5 }}>
                <Grid
                    container
                    spacing={4}
                    sx={{ width: "fit-content", mx: "auto", justifyContent: "center", flexGrow: 1 }}
                >
                    {sorted.map((text, index) => {
                        let sel_level = levels.find((item) => item.level_id === text.level_id);
                        let diff = cdavg(sel_level?.difficulty_votes);
                        return sel_level ? (
                            <Grid sx={{ width: "fit-content" }} key={`grid-${text.level_id}`}>
                                <Card
                                    key={`map-card-${index}`}
                                    sx={{
                                        width: cardSize.width,
                                        display: "flex",
                                        justifySelf: "center",
                                        my: 0,
                                        height: cardSize.height,
                                        overflow: "hidden",
                                        p: 0,
                                    }}
                                >
                                    <CardContent sx={{ height: "100%" }}>
                                        <Stack
                                            spacing={1}
                                            direction={cardSize.side}
                                            sx={{ height: "100%" }}
                                        >
                                            <Box
                                                component="img"
                                                src={sel_level.image}
                                                sx={{ aspectRatio: "16 / 9", height: "100%" }}
                                            />
                                            <Stack spacing={1} sx={{ p: 2 }}>
                                                <Link
                                                    level={fontSizeA}
                                                    fontWeight="xl"
                                                    href={"/gff/#/levels/" + sel_level?.level_id}
                                                    sx={{
                                                        color: "black",
                                                        "&:hover": { textDecorationColor: "black" },
                                                    }}
                                                >
                                                    {sel_level.level_name}
                                                </Link>
                                                <Typography level={fontSizeB} fontWeight="lg">
                                                    {`Host: ${sel_level.host} / Verify: ${sel_level.verifier}`}
                                                </Typography>
                                                <Typography level={fontSizeC} fontWeight="md">
                                                    {`ID: ${sel_level.level_id}`}
                                                    {`${
                                                        pdavg(diff) !== "na" && diff
                                                            ? ` / 난이도: ${pdavg(diff)}`
                                                            : " / 난이도: N/A"
                                                    }`}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ) : (
                            <React.Fragment key={`map-card-${index}`} />
                        );
                    })}
                </Grid>
            </Box>
        </>
    );
}

export default LevelsMain;