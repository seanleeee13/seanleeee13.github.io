import {
    Sheet,
    Stack,
    IconButton,
    Drawer,
    ModalClose,
    DialogTitle,
    Box,
    List,
    ListItemButton,
    Divider,
    Button,
    Typography,
    ListItem,
} from "@mui/joy";
import { useState, useEffect } from "react";
import { MenuIcon, ReactIcon, ExpandMoreIcon } from "./assets";
import { GetLoggedIn } from "./utils";

interface AppBarProps {
    link: [string, string][];
    list: Record<string, [string, string][]>;
}

function AppBar({ link, list }: AppBarProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    useEffect(() => {
        (async () => {
            setHasSession(await GetLoggedIn());
            setLoading(false);
        })();
    }, []);
    const hashPart = window.location.hash.split("?")[1];
    const query = hashPart ? "?" + hashPart : window.location.search || "";
    const linkElement = (
        <Stack
            divider={
                <Typography sx={{ transform: "rotate(270deg)" }}>
                    <ExpandMoreIcon />
                </Typography>
            }
        >
            {link.map(([name, href]) => (
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    key={`button-${href}`}
                    href={href.startsWith("q:") ? href.slice(2) + query : href}
                >
                    {name}
                </Button>
            ))}
        </Stack>
    );
    const listElement = (
        <Stack divider={<Divider />}>
            {Object.entries(list).map(([listName, listData], groupIdx) => (
                <List key={`group-${groupIdx}`}>
                    <ListItem>{listName}</ListItem>
                    {listData.map(([name, href]) => (
                        <ListItemButton
                            key={`listitembutton-${href}`}
                            component="a"
                            href={href.startsWith("q:") ? href.slice(2) + query : href}
                            onClick={() => setOpen(false)}
                        >
                            {name}
                        </ListItemButton>
                    ))}
                </List>
            ))}
        </Stack>
    );
    return (
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
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                <IconButton
                    variant="outlined"
                    color="neutral"
                    size="md"
                    onClick={() => setOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer open={open} onClose={() => setOpen(false)} size="sm">
                    <ModalClose />
                    <DialogTitle>
                        <Box>
                            <IconButton
                                sx={{
                                    width: "35px",
                                    height: "35px",
                                    "& svg": {
                                        fontSize: "30px",
                                    },
                                }}
                                component="a"
                                href="/"
                            >
                                <ReactIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <br />
                    <Box role="presentation" sx={{ p: 1 }}>
                        {listElement}
                    </Box>
                </Drawer>
                <IconButton variant="plain" size="md" component="a" href="/">
                    <ReactIcon />
                </IconButton>
                {link.length !== 0 ? <Divider orientation="vertical" /> : null}
                {linkElement}
            </Stack>
            {!hasSession ? (
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={2}
                    sx={{ width: "100%" }}
                >
                    <Button
                        variant="solid"
                        color="neutral"
                        component="a"
                        href={"/#/signup" + query}
                        loading={loading}
                    >
                        Sign Up
                    </Button>
                    <Button
                        variant="outlined"
                        color="neutral"
                        component="a"
                        href={"/#/login" + query}
                        loading={loading}
                    >
                        Log In
                    </Button>
                </Stack>
            ) : (
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={2}
                    sx={{ width: "100%" }}
                >
                    <Button variant="outlined" color="neutral" component="a" href={"/#/logout/"}>
                        Log Out
                    </Button>
                </Stack>
            )}
        </Sheet>
    );
}

export default AppBar;