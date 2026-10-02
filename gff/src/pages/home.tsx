import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import accordionSummaryClasses from "@mui/joy/AccordionSummary/accordionSummaryClasses";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import { useState, useEffect, useRef } from "react";
import { supabase, type LevelInterface, type ListInterface, type PListInterface } from "components/utils";
import { ExpandMoreIcon } from "components/assets";
import { AppBar } from "components";
import { Box, Card, CardContent, IconButton } from "@mui/joy";
import { cdavg } from "../utils/calculate_difficulty_avg";
import { useNavigate } from "react-router-dom";

function Home() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth
    });
    const [cardWidth, setCardWidth] = useState(300);
    const cardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) {
            return;
        }
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth
            });
            if (!cardRef.current) {
                return;
            }
            setCardWidth(cardRef.current.getBoundingClientRect().width);
        };
        requestAnimationFrame(handleResize);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [loading]);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const [levelResult, listResult, plistResult] = await Promise.all([
                    supabase.from("level").select("*"),
                    supabase.from("list").select("*").order("id"),
                    supabase.from("plist").select("*").order("id")
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
    const levelWidth = 0.71269216419 * dimensions.width - 104;
    const [recentPage, setRecentPage] = useState(1);
    const [unratedPage, setUnratedPage] = useState(1);
    const count = Math.max(Math.floor(levelWidth / 316), 1);
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
    if (loading) {
        return (
            <>
                <CircularProgress />
                <Typography level="h4">Loading...</Typography>
            </>
        );
    }
    type MenuListType = [string, [string, string][]][];
    return (
        <>
            <AppBar
                link={[["GFF", "/gff/"]]}
                list={
                    [
                        ...data.map((text) => [
                            text[0][1],
                            text
                                .slice(1)
                                .map((text_data) => [text_data[1], `/gff/#/lists/${text_data[0]}/`])
                        ]),
                        [
                            "GFF",
                            [
                                ["리스트 목록", "/gff/#/lists/"],
                                ["레벨 검색하기", "/gff/#/levels/"],
                                ["레벨 업로드", "/gff/#/upload/"]
                            ]
                        ]
                    ] as MenuListType
                }
                content={["GFF", "/gff/"]}
            />
            <Box
                sx={{
                    overflowY: "auto",
                    height: "calc(100vh - 64px)",
                    scrollbarGutter: "stable both-edges"
                }}
            >
                <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                    <Typography level="h1">Geometry Dash Friend Forum / GFF</Typography>
                    <Typography level="h3">최근 레벨</Typography>
                    <Stack
                        sx={{
                            overflowY: "visible",
                            width: "100%",
                            height: "fit-content",
                            alignItems: "stretch",
                            display: "flex"
                        }}
                        direction="row"
                        spacing={2}
                    >
                        <IconButton
                            variant="plain" disabled={recentPage === 1}
                            onClick={() => { setRecentPage(recentPage - 1); }}
                        >
                            <Box sx={{ transform: "rotate(90deg)" }}>
                                <ExpandMoreIcon />
                            </Box>
                        </IconButton>
                        {levels
                        .toSorted((a, b) => (
                            new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime()
                        ))
                        .slice(recentPage - 1, recentPage + count - 1)
                        .map((sel_level, index) => {
                            let diff = cdavg(sel_level?.difficulty_votes);
                            return sel_level ? (
                                <Card
                                    key={`map-card-${index}`}
                                    sx={{
                                        display: "flex",
                                        justifySelf: "center",
                                        my: 5,
                                        overflow: "hidden",
                                        p: 0,
                                        cursor: "pointer",
                                        flexShrink: 0,
                                        flex: 1,
                                        height: "auto"
                                    }}
                                    onClick={() => {
                                        navigate(
                                            "/levels/" + sel_level?.level_id + "/"
                                        );
                                    }}
                                    ref={index === 0 ? cardRef : null}
                                >
                                    <CardContent sx={{ height: "100%" }}>
                                        <Stack
                                            spacing={1}
                                            direction="column"
                                            sx={{ height: "100%" }}
                                        >
                                            <Box
                                                component="img"
                                                src={sel_level.image}
                                                sx={{ aspectRatio: "16 / 9", width: "100%" }}
                                            />
                                            <Stack spacing={1} sx={{ p: 2 }}>
                                                <Stack spacing={1} direction="row" width="100%">
                                                    <Link
                                                        level="h4"
                                                        fontWeight="xl"
                                                        href={
                                                            "/gff/#/levels/" +
                                                            sel_level?.level_id +
                                                            "/"
                                                        }
                                                        sx={{
                                                            color: "black",
                                                            "&:hover": { textDecorationColor: "black" }
                                                        }}
                                                    >
                                                        {sel_level.level_name}
                                                    </Link>
                                                    <img
                                                        src={`/gff/assets/${
                                                            diff && diff[3] < 0.5
                                                                ? diff[0] === 0
                                                                    ? {
                                                                        1: "auto",
                                                                        2: "easy",
                                                                        3: "normal",
                                                                        4: "hard",
                                                                        5: "hard",
                                                                        6: "harder",
                                                                        7: "harder",
                                                                        8: "insane",
                                                                        9: "insane"
                                                                    }[Math.round(diff[1])]
                                                                    : diff[1] <= 5
                                                                    ? "demon-easy"
                                                                    : diff[1] <= 10
                                                                        ? "demon-medium"
                                                                        : diff[1] <= 15
                                                                        ? "demon-hard"
                                                                        : diff[1] <= 20
                                                                            ? "demon-insane"
                                                                            : "demon-extreme"
                                                                : "unrated"
                                                        }${
                                                            diff && diff[3] < 0.5
                                                                ? {
                                                                    0: "",
                                                                    1: "-featured",
                                                                    2: "-epic",
                                                                    3: "-legendary",
                                                                    4: "-mythic"
                                                                }[Math.round(diff[2])]
                                                                : ""
                                                        }.png`}
                                                        width="30px"
                                                        height="30px"
                                                    />
                                                </Stack>
                                                <Typography level="title-sm" fontWeight="lg">
                                                    {`Host: ${sel_level.host} / Verify: ${sel_level.verifier}`}
                                                </Typography>
                                                <Typography level="body-sm" fontWeight="md">
                                                    {`ID: ${sel_level.level_id}`}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ) : null;
                        })}
                        <IconButton
                            variant="plain" disabled={recentPage === 10}
                            onClick={() => { setRecentPage(recentPage + 1) }}
                        >
                            <Box sx={{ transform: "rotate(270deg)" }}>
                                <ExpandMoreIcon />
                            </Box>
                        </IconButton>
                    </Stack>
                    {
                        levels
                            .filter((text) => Object.keys(text.difficulty_votes).length === 0)
                            .length !== 0
                        ? <Typography level="h3">미레이팅 레벨</Typography>
                        : null
                    }
                    {
                        levels
                            .filter((text) => Object.keys(text.difficulty_votes).length === 0)
                            .length !== 0
                        ? <Stack
                            sx={{
                                overflowY: "visible",
                                height: "fit-content",
                                alignItems: "stretch",
                                display: "flex"
                            }}
                            direction="row"
                            spacing={2}
                        >
                            <IconButton
                                variant="plain" disabled={unratedPage === 1}
                                onClick={() => { setUnratedPage(unratedPage - 1); }}
                            >
                                <Box sx={{ transform: "rotate(90deg)" }}>
                                    <ExpandMoreIcon />
                                </Box>
                            </IconButton>
                            {levels
                            .filter((text) => Object.keys(text.difficulty_votes).length === 0)
                            .toSorted((a, b) => (
                                new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime()
                            ))
                            .slice(unratedPage - 1, unratedPage + count - 1)
                            .map((sel_level, index) => {
                                let diff = cdavg(sel_level?.difficulty_votes);
                                return sel_level ? (
                                    <Card
                                        key={`map-card-${index}`}
                                        sx={{
                                            display: "flex",
                                            justifySelf: "center",
                                            my: 5,
                                            overflow: "hidden",
                                            p: 0,
                                            cursor: "pointer",
                                            flexShrink: 0,
                                            flexGrow: 0,
                                            height: "auto",
                                            width: `${cardWidth}px`
                                        }}
                                        onClick={() => {
                                            navigate(
                                                "/levels/" + sel_level?.level_id + "/"
                                            );
                                        }}
                                    >
                                        <CardContent sx={{ height: "100%" }}>
                                            <Stack
                                                spacing={1}
                                                direction="column"
                                                sx={{ height: "100%" }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={sel_level.image}
                                                    sx={{ aspectRatio: "16 / 9", width: "100%" }}
                                                />
                                                <Stack spacing={1} sx={{ p: 2 }}>
                                                    <Stack spacing={1} direction="row" width="100%">
                                                        <Link
                                                            level="h4"
                                                            fontWeight="xl"
                                                            href={
                                                                "/gff/#/levels/" +
                                                                sel_level?.level_id +
                                                                "/"
                                                            }
                                                            sx={{
                                                                color: "black",
                                                                "&:hover": { textDecorationColor: "black" }
                                                            }}
                                                        >
                                                            {sel_level.level_name}
                                                        </Link>
                                                        <img
                                                            src={`/gff/assets/${
                                                                diff && diff[3] < 0.5
                                                                    ? diff[0] === 0
                                                                        ? {
                                                                            1: "auto",
                                                                            2: "easy",
                                                                            3: "normal",
                                                                            4: "hard",
                                                                            5: "hard",
                                                                            6: "harder",
                                                                            7: "harder",
                                                                            8: "insane",
                                                                            9: "insane"
                                                                        }[Math.round(diff[1])]
                                                                        : diff[1] <= 5
                                                                        ? "demon-easy"
                                                                        : diff[1] <= 10
                                                                            ? "demon-medium"
                                                                            : diff[1] <= 15
                                                                            ? "demon-hard"
                                                                            : diff[1] <= 20
                                                                                ? "demon-insane"
                                                                                : "demon-extreme"
                                                                    : "unrated"
                                                            }${
                                                                diff && diff[3] < 0.5
                                                                    ? {
                                                                        0: "",
                                                                        1: "-featured",
                                                                        2: "-epic",
                                                                        3: "-legendary",
                                                                        4: "-mythic"
                                                                    }[Math.round(diff[2])]
                                                                    : ""
                                                            }.png`}
                                                            width="30px"
                                                            height="30px"
                                                        />
                                                    </Stack>
                                                    <Typography level="title-sm" fontWeight="lg">
                                                        {`Host: ${sel_level.host} / Verify: ${sel_level.verifier}`}
                                                    </Typography>
                                                    <Typography level="body-sm" fontWeight="md">
                                                        {`ID: ${sel_level.level_id}`}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ) : null;
                            })}
                            <IconButton
                                variant="plain"
                                disabled={
                                    unratedPage === 10
                                    || unratedPage === levels
                                        .filter((text) => Object.keys(text.difficulty_votes).length === 0)
                                        .length
                                }
                                onClick={() => { setUnratedPage(unratedPage + 1) }}
                            >
                                <Box sx={{ transform: "rotate(270deg)" }}>
                                    <ExpandMoreIcon />
                                </Box>
                            </IconButton>
                        </Stack>
                        : null
                    }
                    <Typography level="h3">둘러보기</Typography>
                    <AccordionGroup
                        sx={{
                            maxWidth: 400,
                            [`& .${accordionSummaryClasses.indicator}`]: {
                                transition: "0.2s"
                            },
                            [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                                transform: "rotate(180deg)"
                            }
                        }}
                        color="primary"
                        variant="outlined"
                    >
                        {data.map((text) => (
                            <Accordion key={`map-group-${text}`}>
                                <AccordionSummary indicator={<ExpandMoreIcon />}>
                                    <Typography component="span">
                                        {text[0][1]} / {text[0][0]}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {text.slice(1).map((text_data) => (
                                        <Link
                                            href={"/gff/#/lists/" + text_data[0]}
                                            key={`map-map-group-${text_data}`}
                                        >
                                            {text_data[1]} / {text_data[0]}
                                        </Link>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </AccordionGroup>
                    <Stack direction="row" spacing={1}>
                        <Button component="a" href="/gff/#/lists/" variant="outlined">
                            리스트 목록
                        </Button>
                        <Button component="a" href="/gff/#/levels/" variant="outlined">
                            레벨 검색하기
                        </Button>
                        <Button component="a" href="/gff/#/upload/" variant="outlined">
                            레벨 업로드하기
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default Home;