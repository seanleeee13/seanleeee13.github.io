import { Stack, Box, Typography, Link } from "@mui/joy";

function MainPost1() {
    return (
        <Box
            sx={{
                overflowY: "auto",
                height: "calc(100vh - 64px)",
                scrollbarGutter: "stable both-edges"
            }}
        >
            <Stack
                direction="column"
                spacing={3}
                sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}
            >
                <Typography level="h1">[Main] 개인정보 수집, 이용 안내 & 저작권 고지</Typography>
                <Typography level="h3">1. 개인정보 수집</Typography>
                <Stack direction="column" spacing={1}>
                    <Typography level="body-lg">- 수집 항목: 이메일 주소, 비밀번호</Typography>
                    <Typography level="body-lg">- 수집 목적: 개인 식별, 서비스 제공</Typography>
                    <Typography level="body-lg">- 보유 기간: 회원 탈퇴 시까지</Typography>
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Typography level="h3">2. 이미지 저작권 & 출처 고지</Typography>
                    <Typography level="body-lg">- Admin 배너 이미지: <Link href="https://www.flaticon.com/kr/free-icon/crown_679660">Flaticon</Link></Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

export const title = "[Main] 개인정보 수집, 이용 안내 & 저작권 고지";

export default MainPost1;