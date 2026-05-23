import Typography from "@mui/joy/Typography";
import MenuIcon from "../assets/menu";
import GFFIcon from "../assets/gff";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import Button from "@mui/joy/Button"
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Divider from "@mui/joy/Divider";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle"; 
import { useParams } from "react-router-dom";
import { useState } from "react";
import Image from "../assets/image.png"

function Levels() {
    const { level_list } = useParams<{ level_list: string }>();
    const [open, setOpen] = useState(false);
    const data = [
        [
            ["FLL", "Friend Level List / 공식 레벨 순위"],
            ["TLL", "Featured Level List / 피쳐드 레벨 순위"],
            ["ELL", "Epic Level List / 에픽 레벨 순위"],
            ["NLL", "Unfeatured Level List / 모든 레벨 순위"],
            ["CLL", "Challenge Level List / 챌린지 레벨 순위"],
            ["ULL", "Featured Level List / 언베리파이드 레벨 순위"],
            ["ILL", "Impossible Level List / 불가능 레벨 순위"],
            ["RLL", "Creating Level List / 레벨 크리에이팅 순위"]
        ],
        [
            ["BLL", "Beated Level List / 깬 레벨 순위"],
            ["BDL", "Beated Demon List / 깬 데몬 순위"]
        ]
    ];
    const data_list = [];
    let text;
    for (let i = 0; i < data.length; i++) {
        text = data[i];
        for (let j = 1; j < text.length; j++) {
            data_list.push(text[j][0]);
        }
    }
    if (!level_list || !data_list.includes(level_list)) {
        return;
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
                            <Box sx={{fontSize: "xl"}}>
                                <GFFIcon />
                            </Box>
                        </DialogTitle>
                        <br />
                        <Box role="presentation" sx={{p: 1}}>
                            {data.map((text, index) => (
                                <>
                                    <List>
                                        <ListItem key={text[0][0]}>
                                            <Typography sx={{fontWeight: "lg"}}>{text[0][1]}</Typography>
                                        </ListItem>
                                        {text.slice(1).map((text_data) => (
                                            <ListItem key={text_data[0]}>
                                                <ListItemButton component="a" href={"#/levels/" + text_data[0]}>{text_data[1]}</ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                    {index < data.length - 1 && (
                                        <Divider />
                                    )}
                                </>
                            ))}
                        </Box>
                    </Drawer>
                    <IconButton variant="plain" size="md" component="a" href="/">
                        <GFFIcon />
                    </IconButton>
                    <Button variant="plain" color="neutral" component="a" href="/">Main</Button>
                </Stack>
            </Sheet>
            <Card sx={{width: "50%", display: "flex", justifySelf: "center", my: 5, height: 135, overflow: "hidden", p: 0}}>
                <CardContent>
                    <Stack spacing={1} direction="row">
                        <Box sx={{width: 240, height: 135, backgroundImage: `url(${Image})`}} />
                        <Stack spacing={1} sx={{p: 2}}>
                            <Typography level="h4" fontWeight="xl">#1 - Subplex Final</Typography>
                            <Typography level="title-lg" fontWeight="lg">Host: seanleeee13 / Verify: seanleeee13</Typography>
                            <Typography level="body-sm" fontWeight="md">md6ep (6 / 1)</Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}

export default Levels;