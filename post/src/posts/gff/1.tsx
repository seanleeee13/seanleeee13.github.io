import { Stack, Box, Typography, Link } from "@mui/joy";

function GFFPost1() {
    return (
        <Box
            sx={{
                overflowY: "auto",
                height: "calc(100vh - 64px)",
                scrollbarGutter: "stable both-edges"
            }}
        >
            <Stack direction="column" spacing={5} sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}>
                <Typography level="h1">[GFF] 개인정보 수집, 이용 안내 & 저작권 고지</Typography>
                <Stack direction="column" spacing={1}>
                    <Typography level="h3">1. 개인정보 수집</Typography>
                    <Typography level="body-lg">
                        - 수집 항목: Geometry Dash ID, Account ID
                    </Typography>
                    <Typography level="body-lg">
                        - 수집 목적: Geometry Dash 서버 요청 전송, 유저명 데이터 조회 등
                    </Typography>
                    <Typography level="body-lg">
                        - 제3자 공유 (Geometry Dash ID): GFF 서비스를 사용하는 모든 사람
                    </Typography>
                    <Typography level="body-lg">
                        - 보유 기간: 회원 탈퇴 시까지 (또는 GFF 사용 중단 요청 시까지)
                    </Typography>
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Typography level="h3">2. 이미지 저작권 & 출처 고지</Typography>
                    <Typography level="body-lg">
                        - 해당 사이트에 업로드하는 모든 사진 및 동영상의 저작권 및 법적 책임은
                        전적으로 업로드자 본인에게 있습니다.
                    </Typography>
                    <Typography level="body-lg">
                        - 배너 이미지:{" "}
                        <Link href="https://www.geometrydash.com">Geometry Dash</Link>
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

export const title = "[GFF] 개인정보 수집, 이용 안내 & 저작권 고지";

export default GFFPost1;