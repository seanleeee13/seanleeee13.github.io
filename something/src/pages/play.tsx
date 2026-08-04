import Typography from "@mui/joy/Typography";
import MenuIcon from "../assets/menu.tsx";
import ReactLogoIcon from "../assets/react_logo.tsx";
import ExpandMoreIcon from "../assets/expand_more";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import Button from "@mui/joy/Button"
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase_key.tsx";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/joy/Divider";

function Play() {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const checkLoggedUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setHasSession(true);
            } else {
                setHasSession(false);
            }
            setLoading(false);
        };
        checkLoggedUser();
    }, [navigate]);
    if (loading) {
        return null;
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
                                    <ReactLogoIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <br />
                        <Box role="presentation" sx={{p: 1}}>
                            <List>
                                <ListItem>
                                    <Typography sx={{fontWeight: "lg"}}>기본 기능</Typography>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href="/something/">
                                        Home
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component="a" onClick={() => {setOpen(false)}} href="/something/#/play/">
                                        Play
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <ReactLogoIcon />
                    </IconButton>
                    <Divider orientation="vertical" />
                    <Button variant="plain" color="neutral" component="a" href="/something/">Something</Button>
                    <Typography sx={{transform: "rotate(270deg)"}}><ExpandMoreIcon /></Typography>
                    <Button variant="plain" color="neutral" component="a" href="/something/#/play/">Play</Button>
                </Stack>
                <Stack
                    direction="row-reverse"
                    alignItems="center"
                    spacing={1}
                    sx={{width: "100%"}}
                >
                    {
                        hasSession ?
                        <Button variant="plain" color="neutral" component="a" href="/#/logout/">Log Out</Button> :
                        <>
                            <Button variant="solid" color="neutral" component="a" href="/#/signup/">Sign Up</Button>
                            <Button variant="outlined" color="neutral" component="a" href="/#/login/">Log In</Button>
                        </>
                    }
                </Stack>
            </Sheet>
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                <Typography level="h1">PLAY</Typography>
            </Stack>
        </>
    );
}

export default Play;