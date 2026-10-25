import { Stack, Box, Typography } from "@mui/joy";

function StagePost1() {
    return (
        <Box
            sx={{
                overflowY: "auto",
                height: "calc(100vh - 64px)",
                scrollbarGutter: "stable both-edges"
            }}
        >
            <Stack direction="column" spacing={5} sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}>
                <Typography level="h1">[Stage] 개인정보 수집, 이용 안내 & 저작권 고지</Typography>
                <Stack direction="column" spacing={1}>
                    <Typography level="h3">1. 개인정보 수집</Typography>
                    <Typography level="body-lg">- 해당 사항 없음</Typography>
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Typography level="h3">2. 이미지 저작권 & 출처 고지</Typography>
                    <Typography level="body-lg">- 해당 사항 없음</Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

export const title = "[Stage] 개인정보 수집, 이용 안내 & 저작권 고지";

export default StagePost1;