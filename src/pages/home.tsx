import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import accordionSummaryClasses from "@mui/joy/AccordionSummary/accordionSummaryClasses";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Typography from "@mui/joy/Typography";
import ExpandMoreIcon from "../assets/expand_more";
import MenuIcon from "../assets/menu";
import GFFIcon from "../assets/gff";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import Button from "@mui/joy/Button"
import Drawer from "@mui/joy/Drawer";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Divider from "@mui/joy/Divider";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import { useState } from "react";

function Home() {
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
            <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                <Typography level="h1">Geometry Dash Friend Forum / GFF</Typography>
                <Typography level="h3">1. 리스트 목록</Typography>
                <AccordionGroup sx={{
                    maxWidth: 400,
                    [`& .${accordionSummaryClasses.indicator}`]: {
                        transition: "0.2s",
                    },
                    [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                        transform: "rotate(180deg)",
                    }
                }} color="primary" variant="outlined">
                    {data.map((text) => (
                        <Accordion>
                            <AccordionSummary indicator={<ExpandMoreIcon />}>
                                <Typography component="span">{text[0][1]} / {text[0][0]}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {text.slice(1).map((text_data) => (
                                    <Link href={"#/levels/" + text_data[0]}>{text_data[1]} / {text_data[0]}</Link>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionGroup>
                <Typography level="h3">2. 참여자 목록</Typography>
                <Typography level="title-md">이 프로젝트에는 이슬우, 정민준, 최윤호, 박서후, 정하민이 참가하였습니다.</Typography>
            </Stack>
        </>
    );
}

export default Home;