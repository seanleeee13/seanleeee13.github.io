import Typography from "@mui/joy/Typography";
import ExpandMoreIcon from "../assets/expand_more";
import MenuIcon from "../assets/menu";
import GFFIcon from "../assets/gff";
import Link from "@mui/joy/Link";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import Button from "@mui/joy/Button"
import FormControl from "@mui/joy/FormControl"
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Divider from "@mui/joy/Divider";
import ModalClose from "@mui/joy/ModalClose";
import CircularProgress from "@mui/joy/CircularProgress";
import DialogTitle from "@mui/joy/DialogTitle";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tab from "@mui/joy/Tab";
import React, { useState, useEffect } from "react";
import { supabase, type LevelInterface, type ListInterface, type PListInterface, type UserInterface } from "../utils/supabase_key";

function Upload() {
    const [levels, setLevels] = useState<LevelInterface[]>([]);
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
    });
    const [levelUploadErrorData, setLevelUploadErrorData] = useState({
        id: false,
        name: false,
        host: false,
        publish: false,
        co_creators: false,
        verifier: false,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setLoading(true);
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const [levelResult, listResult, plistResult, userResult, userListResult] = await Promise.all([
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
                        setUserNameList(userListResult.data
                            .map((data) => data?.user_metadata?.["gff:id"])
                            .filter((val) => !!val) as string[]); 
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
    let text;
    const data = [];
    let last_data = "";
    let target;
    for (let i = 0; i < lists.length; i++) {
        text = lists[i];
        if (last_data !== text.parent) {
            last_data = text.parent;
            target = plists.find((item) => item.name === last_data);
            data.push([[target?.name, target?.long_name]]);
        }
        data[data.length - 1].push([text.name, text.long_name]);
    }
    if (loading) {
        return (
            <>
                <CircularProgress />
                <Typography level="h4">Loading...</Typography>
            </>
        );
    }
    return (
        <>
            <Sheet
            variant="solid"
            color="neutral"
            sx={{
                top: 0,
                zIndex: 1100,
                width: "100%",
                height: "64px",
                px: 2,
                display: "flex",
                alignItems: "center",
                borderBottom: "1.5px solid #bcbfb6",
                borderColor: "divider",
                bgcolor: "#f6f8fa",
            }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{width: "100%"}}
                >
                    <IconButton variant="outlined" color="neutral" size="md" onClick={() => setOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer open={open} onClose={() => setOpen(false)} size="sm">
                        <ModalClose />
                        <DialogTitle>
                            <Box>
                                <IconButton sx={{
                                    width: "35px",height: "35px",
                                    "& svg": {
                                    fontSize: "30px"
                                    }
                                }} component="a" href="/">
                                    <GFFIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <br />
                        <Box role="presentation" sx={{p: 1}}>
                            {data.map((text, index) => (
                                <React.Fragment key={`map-group-${index}`}>
                                    <List>
                                        <ListItem key={text[0][0]}>
                                            <Typography sx={{fontWeight: "lg"}}>{text[0][1]}</Typography>
                                        </ListItem>
                                        {text.slice(1).map((text_data) => (
                                            <ListItem key={text_data[0]}>
                                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href={"/gff/#/lists/" + text_data[0]}>
                                                    {text_data[1]}
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Divider />
                                </React.Fragment>
                            ))}
                            <List>
                                <ListItem>
                                    <Typography sx={{fontWeight: "lg"}}>모든 기능</Typography>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href={"/gff/#/lists/"}>
                                        리스트 목록
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href={"/gff/#/levels/"}>
                                        레벨 검색하기
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href={"/gff/#/upload/"}>
                                        레벨 업로드하기
                                    </ListItemButton>
                                </ListItem>
                            </List>
                            <Divider />
                            <List>
                                <ListItem>
                                    <Typography sx={{fontWeight: "lg"}}>공통 기능</Typography>
                                </ListItem>
                                <ListItemButton component="a" onClick={() => {setOpen(false)}} href="/#/logout/">
                                    로그아웃
                                </ListItemButton>
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <GFFIcon />
                    </IconButton>
                    <Divider orientation="vertical" />
                    <Button variant="plain" color="neutral" component="a" href="/gff/">GFF</Button>
                    <Typography sx={{transform: "rotate(270deg)"}}><ExpandMoreIcon /></Typography>
                    <Button variant="plain" color="neutral" component="a" href="/gff/#/upload">Upload</Button>
                </Stack>
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={2}
                    sx={{width: "100%"}}
                >
                    <Button variant="plain" color="neutral" component="a" href="/#/logout/">Log Out</Button>
                </Stack>
            </Sheet>
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                <Typography level="h1">레벨 업로드하기</Typography>
                <Typography level="h3">지난 3달간 여러분이 원하던 바로 그 기능이 추가되었습니다.</Typography>
                <Typography level="body-xs">근데 아직 BDL은 안됩니다.</Typography>
                <Tabs aria-label="tab-1" defaultValue={0}>
                    <TabList>
                        <Tab>레벨 업로드하기</Tab>
                        <Tab>리스트에 등재하기</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <Stack spacing={2}>
                            <Typography level="h4">다음 칸들을 모두 채워넣어 레벨을 업로드하세요.</Typography>
                            <Typography level="title-md"><Typography textColor="red">*</Typography> 표시는 필수 입력 항목입니다.</Typography>
                            <br />
                            <Box alignItems="center" width="100%">
                                <Stack spacing={2} maxWidth={500} width="auto" mx="auto">
                                    <Input placeholder="ID" endDecorator={<Typography textColor="red">*</Typography>}
                                    error={levelUploadErrorData.id} value={levelUploadInputData.id} onChange={(event) => {
                                        let val = event.target.value;
                                        val = val.replace(/[^0-9]/g, "");
                                        if (val.length > 1) {
                                            val = val.replace(/^0+/, "");
                                            if (val === "") {
                                                val = "0";
                                            }
                                        }
                                        setLevelUploadInputData({...levelUploadInputData, id: val});
                                    }} />
                                    <Input placeholder="Level Name" endDecorator={<Typography textColor="red">*</Typography>}
                                    error={levelUploadErrorData.name} value={levelUploadInputData.name} onChange={(event) => {
                                        let val = event.target.value;
                                        val = val.replace(/[^A-Za-z0-9 ]/g, "");
                                        val = val.slice(0, 20);
                                        setLevelUploadInputData({...levelUploadInputData, name: val});
                                    }} />
                                    <FormControl error={levelUploadErrorData.host}>
                                        <Select
                                            placeholder="Host" endDecorator={<Typography textColor="red">*</Typography>}
                                            value={levelUploadInputData.host} onChange={((_, newValue) => {
                                                setLevelUploadInputData({...levelUploadInputData, host: newValue as string});
                                            })}
                                        >
                                            {[users?.user_metadata?.["gff:id"]].map((text) => (
                                                <Option key={`option-host-${text}`} value={text}>{text}</Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl error={levelUploadErrorData.publish} sx={{ position: 'relative', zIndex: 10 }}>
                                        <Select
                                            placeholder="Publish" endDecorator={<Typography textColor="red">*</Typography>}
                                            value={levelUploadInputData.publish} onChange={((_, newValue) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData, publish: newValue as string
                                                });
                                            })}
                                        >
                                            {userNameList.map((text) => (
                                                <Option key={`option-publish-${text}`} value={text}>{text}</Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl error={levelUploadErrorData.co_creators} sx={{ position: 'relative', zIndex: 5 }}>
                                        <Select
                                            placeholder="Co-creators" multiple
                                            value={levelUploadInputData.co_creators} onChange={((_, newValue) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData, co_creators: newValue as string[]
                                                });
                                            })}
                                        >
                                            {userNameList.map((text) => (
                                                <Option key={`option-co-creators-${text}`} value={text}>{text}</Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl error={levelUploadErrorData.verifier}>
                                        <Select
                                            placeholder="Verifier" endDecorator={<Typography textColor="red">*</Typography>}
                                            value={levelUploadInputData.verifier} onChange={((_, newValue) => {
                                                setLevelUploadInputData({
                                                    ...levelUploadInputData, verifier: newValue as string
                                                });
                                            })}
                                        >
                                            {userNameList.map((text) => (
                                                <Option key={`option-verifier-${text}`} value={text}>{text}</Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Box>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={1}>
                        <Typography level="h4">다음 칸들을 모두 채워넣어 레벨을 리스트에 등재하세요.</Typography>
                    </TabPanel>
                </Tabs>
            </Stack>
        </>
    );
}

export default Upload;