import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    accordionSummaryClasses,
    Box,
    Button,
    Card,
    Checkbox,
    Option,
    Select,
    Slider,
    Stack,
    Typography
} from "@mui/joy";
import { CheckIcon } from "components/assets";
import { supabase, type LevelInterface, type UserInterface } from "components/utils";
import { useEffect, useState } from "react";

interface VoteDiffProps {
    level_id: number;
}

function VoteDiff({ level_id }: VoteDiffProps) {
    const [demon, setDemon] = useState(false);
    const [pts, setPts] = useState(1);
    const [ft, setFt] = useState<"nf" | "ft" | "ep" | "lg" | "mt">("nf");
    const [ipp, setIpp] = useState(false);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        const getVoteData = async () => {
            const {
                data: { session }
            } = await supabase.auth.getSession();
            if (!session?.user) {
                return;
            }
            const { data, error } = await supabase
                .from("level")
                .select("*")
                .eq("level_id", level_id)
                .single();
            if (error) {
                console.log("Vote data select error:", error);
                return;
            }
            const { data: userData, error: userError } = await supabase
                .from("user")
                .select("*")
                .eq("id", session.user.id)
                .single();
            if (userError) {
                console.log("User select error:", userError);
                return;
            }
            if (data) {
                const voteData = (data as LevelInterface).difficulty_votes[
                    userData.user_metadata["gff:id"]
                ];
                setDemon(voteData[0] === 1);
                setPts(voteData[1]);
                setFt(
                    ({ 0: "nf", 1: "ft", 2: "ep", 3: "mt", 4: "lg" } as const)[voteData[2]] ?? "nf"
                );
                setIpp(voteData[3] === 1);
            }
        };
        getVoteData();
    }, [level_id]);
    const handleVote = async () => {
        if (success) {
            return;
        }
        const { data, error: selectErr } = await supabase
            .from("level")
            .select("*")
            .eq("level_id", level_id)
            .single();
        if (selectErr) {
            console.log("Level download error:", selectErr);
            return;
        }
        const {
            data: { session }
        } = await supabase.auth.getSession();
        let user;
        if (session?.user) {
            user = await supabase.from("user").select("*").eq("id", session.user.id).single();
        }
        if (!user) {
            return;
        }
        if (user.error) {
            console.log("User select error:", user.error);
            return;
        }
        const userData = user.data as UserInterface;
        let difficulty_votes = (data as LevelInterface).difficulty_votes;
        const featured = ft === "nf" ? 0 : ft === "ft" ? 1 : ft === "ep" ? 2 : ft === "lg" ? 3 : 4;
        difficulty_votes = {
            ...difficulty_votes,
            [userData.user_metadata["gff:id"]]: [demon ? 1 : 0, pts, featured, ipp ? 1 : 0]
        };
        const { error: updateErr } = await supabase
            .from("level")
            .update({ difficulty_votes })
            .eq("level_id", level_id);
        if (updateErr) {
            console.log("Data upload error:", updateErr);
            return;
        }
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    };
    return (
        <AccordionGroup
            sx={{
                [`& .${accordionSummaryClasses.indicator}`]: {
                    transition: "0.2s"
                },
                [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                    transform: "rotate(180deg)"
                },
                width: {
                    xs: "80vw",
                    sm: "70vw",
                    md: "40vw",
                    lg: "30vw"
                }
            }}
            color="primary"
            variant="outlined"
        >
            <Accordion>
                <AccordionSummary>난이도 투표</AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ m: { xs: 1, sm: 2, md: 3 } }}>
                        <Card sx={{ width: "100%" }}>
                            <Stack spacing={2} alignItems="center">
                                <Stack
                                    spacing={3}
                                    direction="row"
                                    width="fit-content"
                                    sx={{ alignItems: "center" }}
                                >
                                    <img
                                        src={`/gff/assets/${
                                            !demon
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
                                                  }[pts]
                                                : pts <= 5
                                                  ? "demon-easy"
                                                  : pts <= 10
                                                    ? "demon-medium"
                                                    : pts <= 15
                                                      ? "demon-hard"
                                                      : pts <= 20
                                                        ? "demon-insane"
                                                        : "demon-extreme"
                                        }${
                                            {
                                                nf: "",
                                                ft: "-featured",
                                                ep: "-epic",
                                                lg: "-legendary",
                                                mt: "-mythic"
                                            }[ft]
                                        }.png`}
                                        height="40px"
                                    />
                                    <Typography level="h2">
                                        {!demon
                                            ? {
                                                  1: "a",
                                                  2: "e",
                                                  3: "n",
                                                  4: "h",
                                                  5: "h",
                                                  6: "d",
                                                  7: "d",
                                                  8: "i",
                                                  9: "i"
                                              }[pts]
                                            : pts <= 5
                                              ? "ed"
                                              : pts <= 10
                                                ? "md"
                                                : pts <= 15
                                                  ? "hd"
                                                  : pts <= 20
                                                    ? "id"
                                                    : "xd"}
                                        {pts}
                                        {ft}
                                    </Typography>
                                </Stack>
                                <Stack
                                    spacing={3}
                                    direction="row"
                                    width="90%"
                                    sx={{ alignItems: "center" }}
                                >
                                    <Checkbox
                                        checked={demon}
                                        label="Demon"
                                        onChange={(event) => {
                                            setDemon(event.target.checked);
                                            setPts(1);
                                        }}
                                    />
                                    <Slider
                                        value={pts}
                                        min={1}
                                        max={demon ? 39 : 9}
                                        valueLabelDisplay="auto"
                                        onChange={(_, value) => {
                                            setPts(value as number);
                                        }}
                                    />
                                </Stack>
                                <Stack
                                    spacing={3}
                                    direction="row"
                                    width="fit-content"
                                    sx={{ alignItems: "center" }}
                                >
                                    <Select
                                        value={ft}
                                        onChange={(_, newValue) => {
                                            if (newValue) {
                                                setFt(newValue);
                                            }
                                        }}
                                    >
                                        <Option value="nf">Unfeatured</Option>
                                        <Option value="ft">Featured</Option>
                                        <Option value="ep">Epic</Option>
                                        <Option value="lg">Legendary</Option>
                                        <Option value="mt">Mythic</Option>
                                    </Select>
                                    <Checkbox
                                        checked={ipp}
                                        label="Ipp"
                                        onChange={(event) => {
                                            setIpp(event.target.checked);
                                        }}
                                    />
                                </Stack>
                                <Button
                                    onClick={handleVote}
                                    color={success ? "success" : "primary"}
                                    startDecorator={success ? <CheckIcon /> : null}
                                >
                                    제출
                                </Button>
                            </Stack>
                        </Card>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </AccordionGroup>
    );
}

export default VoteDiff;