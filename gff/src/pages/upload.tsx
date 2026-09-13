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
import { useState, useEffect, useRef } from "react";
import {
    supabase,
    type LevelInterface,
    type ListInterface,
    type PListInterface,
    type UserInterface
} from "components/utils";
import Checkbox from "@mui/joy/Checkbox";
import { AppBar } from "components";
import { Button, IconButton, Modal, ModalClose, ModalDialog, Textarea } from "@mui/joy";
import { ClearIcon, UploadIcon } from "components/assets";

function Upload() {
    const [open, setOpen] = useState(false);
    const [_, setLevels] = useState<LevelInterface[]>([]);
    const [lists, setLists] = useState<ListInterface[]>([]);
    const [plists, setPLists] = useState<PListInterface[]>([]);
    const [users, setUsers] = useState<UserInterface | null>(null);
    const [userNameList, setUserNameList] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [levelUploadInputData, setLevelUploadInputData] = useState({
        id: "",
        GDPSId: "",
        isMain: true,
        isGDPS: false,
        name: "",
        publish: null as string | null,
        host: null as string | null,
        co_creators: [] as string[],
        verifier: null as string | null,
        verified: true,
        progress: null as null | number,
        description: "",
        thumbnail: null as File | null,
        showcase: ""
    });
    const [levelUploadErrorData, setLevelUploadErrorData] = useState({
        id: false,
        GDPSId: false,
        isMain: false,
        isGDPS: false,
        name: false,
        host: false,
        publish: false,
        co_creators: false,
        verifier: false,
        verified: false,
        progress: false,
        description: false,
        thumbnail: false,
        showcase: false
    });
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const {
                    data: { session }
                } = await supabase.auth.getSession();
                if (session?.user) {
                    const [levelResult, listResult, plistResult, userResult, userListResult] =
                        await Promise.all([
                            supabase.from("level").select("*"),
                            supabase.from("list").select("*").order("id"),
                            supabase.from("plist").select("*").order("id"),
                            supabase.from("user").select("*").eq("id", session.user.id).single(),
                            supabase.from("user").select("user_metadata")
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
                                .filter((val) => !!val) as string[]
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
    const handleUpload = () => {
        const d = levelUploadInputData;
        const e = new Map<keyof typeof levelUploadErrorData, unknown>();
        const f = new Map<keyof typeof levelUploadInputData, unknown>();
        console.log(d);
        if (!d.isMain && !d.isGDPS) {
            e.set("isMain", true);
            e.set("isGDPS", true);
        }
        f.set("isMain", d.isMain);
        f.set("isGDPS", d.isGDPS);
        if (d.isGDPS) {
            if (!Number.isInteger(+d.GDPSId) || +d.GDPSId <= 0) {
                e.set("GDPSId", true);
            }
            f.set("id", -+d.GDPSId);
            f.set("GDPSId", +d.GDPSId);
        }
        if (d.isMain) {
            if (!Number.isInteger(+d.id) || +d.id <= 0) {
                e.set("id", true);
            }
            f.set("id", +d.id);
        }
        if (!d.name) {
            e.set("name", true);
        }
        f.set("name", d.name.replace(/[^A-Za-z0-9 ]/g, "").slice(0, 20));
        if (!d.host) {
            e.set("host", true);
        }
        f.set("host", d.host);
        if (!d.publish) {
            e.set("publish", true);
        }
        f.set("publish", d.publish);
        f.set("co_creators", d.co_creators);
        if (!d.verifier) {
            e.set("verifier", true);
        }
        f.set("verifier", d.verifier);
        f.set("verified", d.verified);
        if (!d.verified && d.progress === null) {
            e.set("progress", true);
        }
        f.set("progress", d.progress);
        f.set("thumbnail", d.thumbnail);
        const showcase = d.showcase
            .replace("watch?v=", "embed/")
            .replace("youtu.be", "youtube.com/embed")
            .replace(/[?].*/, "");
        if (showcase && !/^(https:\/\/)?(www[.])?youtube.com\/embed\/[a-zA-Z0-9_-]+$/i.test(showcase)) {
            e.set("showcase", true);
        }
        f.set("showcase", showcase || null);
        if (e.size > 0) {
            setLevelUploadErrorData({
                ...levelUploadErrorData,
                ...Object.fromEntries([...e])
            });
            return;
        }
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
                link={[
                    ["GFF", "/gff/"],
                    ["Upload", "/gff/#/upload/"]
                ]}
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
            <Box sx={{ overflowY: "auto", height: "calc(100vh - 64px)", scrollbarGutter: "stable both-edges" }}>
                <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                    <Typography level="h1">레벨 업로드하기</Typography>
                    <Typography level="h3">
                        지난 3달간 여러분이 원하던 바로 그 기능이 추가되었습니다.
                    </Typography>
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
                                        <Stack spacing={2} direction="row" alignItems="center">
                                            <Checkbox
                                                label="Is Main"
                                                checked={levelUploadInputData.isMain}
                                                color={
                                                    levelUploadErrorData.isMain
                                                        ? "danger"
                                                        : "primary"
                                                }
                                                onChange={(event) => {
                                                    setLevelUploadInputData({
                                                        ...levelUploadInputData,
                                                        isMain: event.target.checked,
                                                        isGDPS: !event.target.checked || levelUploadInputData.isGDPS,
                                                        id: event.target.checked ? levelUploadInputData.id : ""
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        isMain: false,
                                                        isGDPS: false,
                                                        id: false
                                                    });
                                                }}
                                            />
                                            <Input
                                                placeholder="Main ID"
                                                endDecorator={
                                                    levelUploadInputData.isMain ?
                                                    <Typography textColor="red">*</Typography> :
                                                    null
                                                }
                                                error={levelUploadErrorData.id}
                                                value={levelUploadInputData.id}
                                                sx={{ flexGrow: 1 }}
                                                disabled={!levelUploadInputData.isMain}
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
                                                        id: val
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        id: false
                                                    });
                                                }}
                                            />
                                        </Stack>
                                        <Stack spacing={2} direction="row" alignItems="center">
                                            <Checkbox
                                                label="Is GDPS"
                                                checked={levelUploadInputData.isGDPS}
                                                color={
                                                    levelUploadErrorData.isGDPS
                                                        ? "danger"
                                                        : "primary"
                                                }
                                                onChange={(event) => {
                                                    setLevelUploadInputData({
                                                        ...levelUploadInputData,
                                                        isMain: !event.target.checked || levelUploadInputData.isMain,
                                                        isGDPS: event.target.checked,
                                                        GDPSId: event.target.checked ? levelUploadInputData.GDPSId : ""
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        isMain: false,
                                                        isGDPS: false,
                                                        GDPSId: false
                                                    });
                                                }}
                                            />
                                            <Input
                                                placeholder="GDPS ID"
                                                endDecorator={
                                                    levelUploadInputData.isGDPS ?
                                                    <Typography textColor="red">*</Typography> :
                                                    null
                                                }
                                                error={levelUploadErrorData.GDPSId}
                                                value={levelUploadInputData.GDPSId}
                                                sx={{ flexGrow: 1 }}
                                                disabled={!levelUploadInputData.isGDPS}
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
                                                        GDPSId: val
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        GDPSId: false
                                                    });
                                                }}
                                            />
                                        </Stack>
                                        <Input
                                            placeholder="Level Name"
                                            endDecorator={
                                                <Typography textColor="red">*</Typography>
                                            }
                                            error={levelUploadErrorData.name}
                                            value={levelUploadInputData.name}
                                            onChange={(event) => {
                                                let val = event.target.value;
                                                val = val.replace(/[^A-Za-z0-9 ]/g, "");
                                                val = val.slice(0, 20);
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    name: val
                                                });
                                                setLevelUploadErrorData({
                                                    ...levelUploadErrorData,
                                                    name: false
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
                                                        host: newValue as string
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        host: false
                                                    });
                                                }}
                                            >
                                                {[users?.user_metadata?.["gff:id"]].map((text) => (
                                                    <Option
                                                        key={`option-host-${text}`}
                                                        value={text}
                                                    >
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
                                                        publish: newValue as string
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        publish: false
                                                    });
                                                }}
                                            >
                                                {userNameList.map((text) => (
                                                    <Option
                                                        key={`option-publish-${text}`}
                                                        value={text}
                                                    >
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
                                                        co_creators: newValue as string[]
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        co_creators: false
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
                                                        verifier: newValue as string
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        verifier: false
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
                                                color={
                                                    levelUploadErrorData.verified
                                                        ? "danger"
                                                        : "primary"
                                                }
                                                onChange={(event) => {
                                                    setLevelUploadInputData({
                                                        ...levelUploadInputData,
                                                        verified: event.target.checked,
                                                        progress: !event.target.checked
                                                            ? levelUploadInputData.progress
                                                            : null
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        progress: false
                                                    })
                                                }}
                                            />
                                            <Input
                                                placeholder="Progress"
                                                disabled={levelUploadInputData.verified}
                                                endDecorator={
                                                    !levelUploadInputData.verified ? (
                                                        <Typography textColor="red">*</Typography>
                                                    ) : null
                                                }
                                                type="number"
                                                error={levelUploadErrorData.progress}
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
                                                                : +event.target.value
                                                    });
                                                    setLevelUploadErrorData({
                                                        ...levelUploadErrorData,
                                                        progress: false
                                                    });
                                                }}
                                            />
                                        </Stack>
                                        <Textarea
                                            placeholder="Description"
                                            error={levelUploadErrorData.description}
                                            value={levelUploadInputData.description}
                                            onChange={(event) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    description: event.target.value
                                                });
                                            }}
                                            minRows={3}
                                        />
                                        <Button
                                            startDecorator={
                                                levelUploadInputData.thumbnail === null ? (
                                                    <UploadIcon />
                                                ) : null
                                            }
                                            color={levelUploadErrorData.thumbnail ? "danger" : "primary"}
                                            endDecorator={
                                                levelUploadInputData.thumbnail === null ? null : (
                                                    <IconButton
                                                        size="sm"
                                                        sx={{
                                                            "& svg": {
                                                                color: levelUploadErrorData.thumbnail ?
                                                                    "var(--joy-palette-danger-500)" :
                                                                    "var(--joy-palette-primary-500)"
                                                            }
                                                        }}
                                                        color={levelUploadErrorData.thumbnail ? "danger" : "primary"}
                                                        onClick={() => {
                                                            setLevelUploadInputData({
                                                                ...levelUploadInputData,
                                                                thumbnail: null
                                                            });
                                                            setLevelUploadErrorData({
                                                                ...levelUploadErrorData,
                                                                thumbnail: false
                                                            });
                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.value = "";
                                                            }
                                                        }}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                )
                                            }
                                            variant="outlined"
                                            sx={{
                                                width: "fit-content",
                                                height: "44px",
                                                pr:
                                                    levelUploadInputData.thumbnail === null
                                                        ? "16px"
                                                        : "6px",
                                                "&:has(button:hover)": {
                                                    backgroundColor: "transparent"
                                                }
                                            }}
                                            component="label"
                                        >
                                            {levelUploadInputData.thumbnail === null
                                                ? "Upload Thumbnail Image"
                                                : levelUploadInputData.thumbnail.name}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{
                                                    display: "none"
                                                }}
                                                accept="image/webp, image/avif, image/jpeg, image/png"
                                                onChange={(event) => {
                                                    const file = event.target.files?.[0] || null;
                                                    if (!file) {
                                                        return;
                                                    }
                                                    console.log(file);
                                                    if (file.size > 128 * 1024) {
                                                        setLevelUploadErrorData({
                                                            ...levelUploadErrorData,
                                                            thumbnail: true
                                                        });
                                                        setOpen(true);
                                                    } else {
                                                        setLevelUploadErrorData({
                                                            ...levelUploadErrorData,
                                                            thumbnail: false
                                                        });
                                                    }
                                                    setLevelUploadInputData({
                                                        ...levelUploadInputData,
                                                        thumbnail: file
                                                    });
                                                }}
                                            />
                                        </Button>
                                        <Modal open={open} onClose={() => { setOpen(false) }}>
                                            <ModalDialog>
                                                <ModalClose />
                                                <Typography level="h4">용량 제한</Typography>
                                                <Typography level="body-lg">이미지 파일 용량은 최대 128KB입니다.</Typography>
                                            </ModalDialog>
                                        </Modal>
                                        <Input
                                            placeholder="Youtube Showcase Video"
                                            slotProps={{
                                                input: { spellCheck: false }
                                            }}
                                            error={levelUploadErrorData.showcase}
                                            value={levelUploadInputData.showcase}
                                            onChange={(event) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData,
                                                    showcase: event.target.value
                                                });
                                                setLevelUploadErrorData({
                                                    ...levelUploadErrorData,
                                                    showcase: false
                                                });
                                            }}
                                        />
                                        <Button
                                            onClick={handleUpload}
                                        >Submit!</Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        </TabPanel>
                        <TabPanel value={1}>
                            <Typography level="h4">
                                {/* 다음 칸들을 모두 채워넣어 레벨을 리스트에 등재하세요. */}
                                레전---드 제작 중
                            </Typography>
                        </TabPanel>
                    </Tabs>
                </Stack>
            </Box>
        </>
    );
}

export default Upload;