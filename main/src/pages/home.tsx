import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Input from "@mui/joy/Input";
import ModalClose from "@mui/joy/ModalClose";
import { useState, useEffect } from "react";
import { GetLoggedIn, supabase, type UserInterface } from "components/utils";
import { Card, Modal } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import { AppBar } from "components";
import { imagemap, descriptionmap, sourcemap, usable } from "../utils/contents.ts";

function MyPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserInterface>();
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const content = [...(users?.role ?? []), ...(users?.vrole ?? []), ...usable];
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                if (session?.user) {
                    const userResult = await supabase
                        .from("user")
                        .select("*")
                        .eq("id", session.user.id)
                        .single();
                    if (userResult.error) {
                        throw userResult.error;
                    }
                    if (userResult.data) {
                        setUsers(userResult.data as UserInterface);
                    }
                }
            } catch (err) {
                console.error("Error while loading list data: ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTableData();
    }, [navigate]);
    if (loading) {
        return null;
    }
    if (users && (users.name === "" || users.name === null)) {
        const handleSaveNickname = async () => {
            const targetNickname = value.trim();
            if (targetNickname.length < 5 || 20 < targetNickname.length) {
                setError(true);
                setErrorMessage("이름은 5글자 이상 20글자 이하여야 합니다.");
                return;
            }
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                return;
            }
            const { error: nicknameSaveError } = await supabase
                .from("user")
                .update({ name: targetNickname })
                .eq("id", session.user.id);
            if (nicknameSaveError) {
                console.error("Nickname Save Fail", nicknameSaveError.message);
                setError(true);
                setErrorMessage("닉네임 저장 중 오류가 발생했습니다.");
                return;
            }
            window.location.reload();
        };
        return (
            <>
                <AppBar
                    link={[]}
                    list={{
                        컨텐츠: content.map(([id, name]) => [name, `/${id}/`]),
                        "공통 기능": [["Log Out", "/#/logout/"]],
                    }}
                />
                <Stack
                    direction="column"
                    spacing={4}
                    sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}
                >
                    <Typography level="h1">마지막입니다. 어떻게 불러드릴까요?</Typography>
                    <Stack
                        direction="column"
                        spacing={4}
                        sx={{ p: 4, mx: "auto", my: 5, maxWidth: 350 }}
                    >
                        <FormControl error={error}>
                            <Input
                                variant="outlined"
                                color="primary"
                                size="lg"
                                placeholder="이름"
                                value={value}
                                onChange={(event) => {
                                    const data = event.target.value.trim();
                                    setValue(data);
                                    if (data.length < 5 || 20 < data.length) {
                                        setError(true);
                                        setErrorMessage(
                                            "이름은 5글자 이상 20글자 이하여야 합니다.",
                                        );
                                    } else {
                                        setError(false);
                                        setErrorMessage("");
                                    }
                                }}
                            />
                            <FormHelperText>{errorMessage}</FormHelperText>
                        </FormControl>
                        <Button
                            variant="solid"
                            color="primary"
                            disabled={error}
                            size="lg"
                            onClick={handleSaveNickname}
                        >
                            제출
                        </Button>
                    </Stack>
                </Stack>
            </>
        );
    }
    return (
        <>
            <AppBar
                link={[]}
                list={{
                    컨텐츠: content.map(([id, name]) => [name, `/${id}/`]),
                    "공통 기능": [["Log Out", "/#/logout/"]],
                }}
            />
            <Stack direction="column" spacing={5} sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}>
                <Typography level="h1">환영합니다, {users?.name}님!</Typography>
                <Stack direction="column" spacing={3} sx={{ maxWidth: 500 }}>
                    {[...(users?.role ?? []), ...(users?.vrole ?? []), ...usable].map(
                        ([id, name]) => {
                            let role = "User";
                            if (!users?.role.some((data) => data[0] === id)) {
                                role = "View";
                            }
                            if (id.split(":").length > 1) {
                                if (id.split(":").at(-1) === "admin") {
                                    role = "Admin";
                                }
                                id = id.split(":")[0];
                            }
                            if (users?.role.some((data) => data[0] === "admin")) {
                                role = "Admin";
                            }
                            return (
                                <Card
                                    key={`Card-${id}`}
                                    onClick={() => {
                                        window.location.href = `/${id}/`;
                                    }}
                                    sx={{
                                        cursor: "pointer",
                                        backgroundImage: {
                                            xs: "none",
                                            sm: `linear-gradient(to right, #FBFCFE 0%, #FBFCFE 40%, transparent 80%, transparent 100%), url("${imagemap[id]}")`,
                                        },
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        aspectRatio: "498.667 / 136",
                                        maxWidth: 500,
                                    }}
                                >
                                    <Typography
                                        level="h3"
                                        sx={{ "&:hover": { textDecoration: "underline" } }}
                                    >
                                        {name}
                                    </Typography>
                                    <Typography level="body-lg">{descriptionmap[id]}</Typography>
                                    <Typography level="body-sm">Permission: {role}</Typography>
                                </Card>
                            );
                        },
                    )}
                </Stack>
                <Button
                    variant="plain"
                    color="neutral"
                    sx={{ maxWidth: 100, bottom: 16, right: 16, position: "fixed" }}
                    onClick={(_) => {
                        setModalOpen(true);
                    }}
                >
                    이미지 출처
                </Button>
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                    <Sheet
                        variant="outlined"
                        sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
                    >
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <Typography level="h4" sx={{ mb: 1 }}>
                            이미지 출처
                        </Typography>
                        {[...(users?.role ?? []), ...(users?.vrole ?? []), ...usable].map(
                            ([id, _]) => {
                                return (
                                    <Typography key={`typography-${id}`} sx={{ mb: 1 }}>
                                        {sourcemap[id]}
                                    </Typography>
                                );
                            },
                        )}
                    </Sheet>
                </Modal>
            </Stack>
        </>
    );
}

function IntroPage() {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <>
            <AppBar
                link={[]}
                list={{
                    컨텐츠: usable.map(([id, name]) => [name, `/${id}/`]),
                    "공통 기능": [
                        ["Sign Up", "/#/signup/"],
                        ["Log In", "/#/login/"],
                    ],
                }}
            />
            <Stack direction="column" spacing={4} sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}>
                <Stack spacing={1.5}>
                    <Typography level="h1">Seanleeee13 Github Pages</Typography>
                    <Typography level="title-lg">내가 하는 모든 것에 대한 사이트</Typography>
                </Stack>
                <Stack direction="column" spacing={3} sx={{ maxWidth: 500 }}>
                    {usable.map(([id, name]) => {
                        return (
                            <Card
                                key={`Card-${id}`}
                                onClick={() => {
                                    window.location.href = `/${id}/`;
                                }}
                                sx={{
                                    cursor: "pointer",
                                    backgroundImage: {
                                        xs: "none",
                                        sm: `linear-gradient(to right, #FBFCFE 0%, #FBFCFE 40%, transparent 80%, transparent 100%), url("${imagemap[id]}")`,
                                    },
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    aspectRatio: "498.667 / 136",
                                    maxWidth: 500,
                                }}
                            >
                                <Typography
                                    level="h3"
                                    sx={{ "&:hover": { textDecoration: "underline" } }}
                                >
                                    {name}
                                </Typography>
                                <Typography level="body-lg">{descriptionmap[id]}</Typography>
                                <Typography level="body-sm">Permission: View</Typography>
                            </Card>
                        );
                    })}
                </Stack>
                <Button
                    variant="plain"
                    color="neutral"
                    sx={{ maxWidth: 100, bottom: 16, right: 16, position: "fixed" }}
                    onClick={(_) => {
                        setModalOpen(true);
                    }}
                >
                    이미지 출처
                </Button>
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                    <Sheet
                        variant="outlined"
                        sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
                    >
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <Typography level="h4" sx={{ mb: 1 }}>
                            이미지 출처
                        </Typography>
                        {usable.map(([id, _]) => {
                            return (
                                <Typography key={`typography-${id}`} sx={{ mb: 1 }}>
                                    {sourcemap[id]}
                                </Typography>
                            );
                        })}
                    </Sheet>
                </Modal>
            </Stack>
        </>
    );
}

function Home() {
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const checkLoggedUser = async () => {
            setHasSession(await GetLoggedIn());
            setLoading(false);
        };
        checkLoggedUser();
    }, [navigate]);
    if (loading) {
        return null;
    }
    return hasSession ? <MyPage /> : <IntroPage />;
}

export default Home;