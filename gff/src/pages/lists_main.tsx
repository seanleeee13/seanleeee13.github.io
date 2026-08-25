import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import accordionSummaryClasses from "@mui/joy/AccordionSummary/accordionSummaryClasses";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import CircularProgress from "@mui/joy/CircularProgress";
import { useState, useEffect } from "react";
import { supabase, type ListInterface, type PListInterface } from "components/utils";
import { AppBar } from "components";
import { ExpandMoreIcon } from "components/assets";

function ListsMain() {
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const [listResult, plistResult] = await Promise.all([
                    supabase.from("list").select("*").order("id"),
                    supabase.from("plist").select("*").order("id"),
                ]);
                if (listResult.error) {
                    throw listResult.error;
                }
                if (plistResult.error) {
                    throw plistResult.error;
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
                link={[["GFF", "/gff/"], ["List", "/gff/#/lists/"]]}
                list={[...data.map((text) => [
                    text[0][1], text.slice(1).map(
                        (text_data) => [text_data[1], `/gff/#/lists/${text_data[0]}/`]
                    )
                ]), [
                    "GFF", [
                        ["리스트 목록", "/gff/#/lists/"],
                        ["레벨 검색하기", "/gff/#/levels/"],
                        ["레벨 업로드", "/gff/#/upload/"]
                    ]
                ]] as MenuListType}
                content={["GFF", "/gff/"]}
            />
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                <Typography level="h3">리스트 목록</Typography>
                <AccordionGroup
                    sx={{
                        maxWidth: 400,
                        [`& .${accordionSummaryClasses.indicator}`]: {
                            transition: "0.2s",
                        },
                        [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                            transform: "rotate(180deg)",
                        },
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
                                        href={"gff/#/lists/" + text_data[0]}
                                        key={`map-map-group-${text_data}`}
                                    >
                                        {text_data[1]} / {text_data[0]}
                                    </Link>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionGroup>
            </Stack>
        </>
    );
}

export default ListsMain;