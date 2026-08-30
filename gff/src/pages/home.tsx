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
import { useState, useEffect } from "react";
import { supabase, type ListInterface, type PListInterface } from "components/utils";
import { ExpandMoreIcon } from "components/assets";
import { AppBar } from "components";

function Home() {
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const [listResult, plistResult] = await Promise.all([
                    supabase.from("list").select("*").order("id"),
                    supabase.from("plist").select("*").order("id")
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
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                <Typography level="h1">Geometry Dash Friend Forum / GFF</Typography>
                <Typography level="h3">1. 리스트 목록</Typography>
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
                <Typography level="h3">2. 모든 기능</Typography>
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
                <Typography level="h3">3. 참여자 목록</Typography>
                <Typography level="title-md">
                    이 프로젝트에는 seanleeee13, problem73481, yunho0927, glowingberri가
                    참가하였습니다.
                </Typography>
                <Typography level="h3">4. 기존 참여자에게의 안내</Typography>
                <Typography level="title-md">
                    1. 현재 대규모 업데이트 중이라서 회원 가입을 한 뒤 권한을 받고 나서 레벨을 볼 수
                    있습니다. 번거롭더라도 아래의 회원 가입 버튼을 눌러 회원 가입을 해 주시면, 8월
                    2일 (일) 에 한번에 권한을 적용해드리겠습니다.
                </Typography>
                <Button variant="solid" color="primary" component="a" href="/#/signup/">
                    Sign Up
                </Button>
                <Typography level="title-md">
                    2. 8월 2일 (일) 쯤에 아마 GFF를 수정할 수 있게 업데이트를 할 예정입니다. 그
                    이후로는 다음과 같은 경우 그에 따른 처벌이 주어집니다.
                </Typography>
                <AccordionGroup color="primary" variant="outlined">
                    <Accordion>
                        <AccordionSummary indicator={<ExpandMoreIcon />}>규정</AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1}>
                                <Typography level="title-sm">
                                    1. 과도하게 부적합한 난이도 투표를 한 경우 (벌점 1점)
                                </Typography>
                                <Typography level="title-sm">
                                    2. 존재하지 않는 레벨이나 가짜 클리어자 정보를 업로드한 경우
                                    (벌점 2점)
                                </Typography>
                                <Typography level="title-sm">
                                    3. 1~2의 행위가 3회 이상 지속적으로 반복된 경우 (벌점 4점)
                                </Typography>
                                <Typography level="title-sm">
                                    4. 1~2의 행위가 경고 문자 확인에도 불구하고 5회 이상 지속적으로
                                    반복되거나 한 번에 많은 조작을 해서 바로잡기가 힘들게 된 경우
                                    (벌점 7점)
                                </Typography>
                                <Typography level="title-sm">
                                    벌점 1~2점: 경고 문자 및 이메일 발신
                                </Typography>
                                <Typography level="title-sm">벌점 3점: 3일 간 GFF 차단</Typography>
                                <Typography level="title-sm">벌점 5점: 7일 간 GFF 차단</Typography>
                                <Typography level="title-sm">벌점 8점: 30일 간 GFF 차단</Typography>
                                <Typography level="title-sm">벌점 10점: 무기한 GFF 차단</Typography>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            </Stack>
        </>
    );
}

export default Home;