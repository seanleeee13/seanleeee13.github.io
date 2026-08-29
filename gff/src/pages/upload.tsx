import Typography from "@mui/joy/Typography";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tab from "@mui/joy/Tab";
import { useState, useEffect } from "react";
import {
    supabase,
    type LevelInterface,
    type ListInterface,
    type PListInterface,
    type UserInterface,
} from "components/utils";
import Checkbox from "@mui/joy/Checkbox";
import { AppBar } from "components";

function Upload() {
    const [_, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [users, setUsers] = useState<UserInterface | null>(null);
    const [userNameList, setUserNameList] = useState<string[]>([]);
    const [levelUploadInputData, setLevelUploadInputData] = useState({
        id: "",
        name: "",
        host: "",
        publish: "",
        co_creators: [] as string[],
        verifier: "",
        verified: true,
        progress: null as null | number,
    });
    const [levelUploadErrorData, ___] = useState({
        id: false,
        name: false,
        host: false,
        publish: false,
        co_creators: false,
        verifier: false,
        verified: false,
        progress: false,
    });
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                if (session?.user) {
                    const [levelResult, listResult, plistResult, userResult, userListResult] =
                        await Promise.all([
                            supabase.from("level").select("*"),
                            supabase.from("list").select("*").order("id"),
                            supabase.from("plist").select("*").order("id"),
                            supabase.from("user").select("*").eq("id", session.user.id).single(),
                            supabase.from("user").select("user_metadata"),
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
                    if (userResult.error) {
                        throw userResult.error;
                    }
                    if (userListResult.error) {
                        throw userListResult.error;
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
                    if (userResult.data) {
                        setUsers(userResult.data as UserInterface);
                    }
                    if (userListResult.data) {
                        setUserNameList(
                            userListResult.data
                                .map((data) => data?.user_metadata?.["gff:id"])
                                .filter((val) => !!val) as string[],
                        );
                    }
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
                link={[["GFF", "/gff/"], ["Upload", "/gff/#/upload/"]]}
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
                <Typography level="h1">레벨 업로드하기</Typography>
                <Typography level="h3">
                    지난 3달간 여러분이 원하던 바로 그 기능이 추가되었습니다.
                </Typography>
                <Typography level="body-xs">근데 아직 BDL은 안됩니다.</Typography>
                <Tabs aria-label="tab-1" defaultValue={0}>
                    <TabList>
                        <Tab>레벨 업로드하기</Tab>
                        <Tab>리스트에 등재하기</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <Stack spacing={2}>
                            <Typography level="h4">
                                다음 칸들을 모두 채워넣어 레벨을 업로드하세요.
                            </Typography>
                            <Typography level="title-md">
                                <Typography textColor="red">*</Typography> 표시는 필수 입력
                                항목입니다.
                            </Typography>
                            <br />
                            <Box alignItems="center" width="100%">
                                <Stack spacing={2} maxWidth={500} width="auto" mx="auto">
                                    <Input
                                        placeholder="ID"
                                        endDecorator={<Typography textColor="red">*</Typography>}
                                        error={levelUploadErrorData.id}
                                        value={levelUploadInputData.id}
                                        onChange={(event) => {
                                            let val = event.target.value;
                                            val = val.replace(/[^0-9]/g, "");
                                            if (val.length > 1) {
                                                val = val.replace(/^0+/, "");
                                                if (val === "") {
                                                    val = "0";
                                                }
                                            }
                                            setLevelUploadInputData({
                                                ...levelUploadInputData,
                                                id: val,
                                            });
                                        }}
                                    />
                                    <Input
                                        placeholder="Level Name"
                                        endDecorator={<Typography textColor="red">*</Typography>}
                                        error={levelUploadErrorData.name}
                                        value={levelUploadInputData.name}
                                        onChange={(event) => {
                                            let val = event.target.value;
                                            val = val.replace(/[^A-Za-z0-9 ]/g, "");
                                            val = val.slice(0, 20);
                                            setLevelUploadInputData({
                                                ...levelUploadInputData,
                                                name: val,
                                            });
                                        }}
                                    />
                                    <FormControl error={levelUploadErrorData.host}>
                                        <Select
                                            placeholder="Host"
                                            endDecorator={
                                                <Typography textColor="red">*</Typography>
                                            }
                                            value={levelUploadInputData.host}
                                            onChange={(__, newValue) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    host: newValue as string,
                                                });
                                            }}
                                        >
                                            {[users?.user_metadata?.["gff:id"]].map((text) => (
                                                <Option key={`option-host-${text}`} value={text}>
                                                    {text}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl error={levelUploadErrorData.publish}>
                                        <Select
                                            placeholder="Publish"
                                            endDecorator={
                                                <Typography textColor="red">*</Typography>
                                            }
                                            value={levelUploadInputData.publish}
                                            onChange={(__, newValue) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    publish: newValue as string,
                                                });
                                            }}
                                        >
                                            {userNameList.map((text) => (
                                                <Option key={`option-publish-${text}`} value={text}>
                                                    {text}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl error={levelUploadErrorData.co_creators}>
                                        <Select
                                            placeholder="Co-creators"
                                            multiple
                                            value={levelUploadInputData.co_creators}
                                            onChange={(__, newValue) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    co_creators: newValue as string[],
                                                });
                                            }}
                                        >
                                            {userNameList.map((text) => (
                                                <Option
                                                    key={`option-co-creators-${text}`}
                                                    value={text}
                                                >
                                                    {text}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl error={levelUploadErrorData.verifier}>
                                        <Select
                                            placeholder="Verifier"
                                            endDecorator={
                                                <Typography textColor="red">*</Typography>
                                            }
                                            value={levelUploadInputData.verifier}
                                            onChange={(__, newValue) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    verifier: newValue as string,
                                                });
                                            }}
                                        >
                                            {userNameList.map((text) => (
                                                <Option
                                                    key={`option-verifier-${text}`}
                                                    value={text}
                                                >
                                                    {text}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Stack spacing={1} direction="row" alignItems="center">
                                        <Checkbox
                                            label="Verified"
                                            checked={levelUploadInputData.verified}
                                            onChange={(event) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    verified: event.target.checked,
                                                    progress: !event.target.checked
                                                        ? levelUploadInputData.progress
                                                        : null,
                                                });
                                            }}
                                        />
                                        <Input
                                            placeholder="Progress"
                                            disabled={levelUploadInputData.verified}
                                            endDecorator={
                                                !levelUploadInputData.verified ? null : (
                                                    <Typography textColor="red">*</Typography>
                                                )
                                            }
                                            type="number"
                                            value={
                                                levelUploadInputData.progress === null
                                                    ? ""
                                                    : levelUploadInputData.progress
                                            }
                                            onChange={(event) => {
                                                if (
                                                    +event.target.value >= 100 ||
                                                    +event.target.value < 0
                                                ) {
                                                    return;
                                                }
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    progress:
                                                        event.target.value === ""
                                                            ? null
                                                            : +event.target.value,
                                                });
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={1}>
                        <Typography level="h4">
                            다음 칸들을 모두 채워넣어 레벨을 리스트에 등재하세요.
                        </Typography>
                    </TabPanel>
                </Tabs>
            </Stack>
        </>
    );
}

export default Upload;