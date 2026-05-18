import { Typography, Link, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material";

function Home() {
    return (
        <>
            <Typography variant="h3">
                Geometry Dash Friend Forum / GFF
            </Typography>
            <br />
            <Typography variant="h5">
                참여자: 이슬우, 정민준, 최윤호, 박서후, 정하민
            </Typography>
            <br />
            <Typography variant="subtitle1" gutterBottom>
                포럼 종류:
            </Typography>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography component="span">Friend Level List / 자작맵 리스트 / FLL</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Link href="#" underline="none">Featured Level List / 피쳐드 자작맵 리스트 / TLL</Link>
                    <Link href="#" underline="none">Every Level List / 언피쳐드 포함 자작맵 리스트 / ELL</Link>
                    <Link href="#" underline="none">Challenge Level List / 챌린지 자작맵 리스트 / CLL</Link>
                    <Link href="#" underline="none">Platformer Level List / 플랫포머 자작맵 리스트 / PLL</Link>
                    <Link href="#" underline="none">Upcoming Level List / 업커밍 자작맵 리스트 / ULL</Link>
                    <Link href="#" underline="none">Impossible Level List / 불가능 자작맵 리스트 / ILL</Link>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

export default Home;