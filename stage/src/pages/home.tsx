import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import bannerImage from "../assets/banner.png";
import Link from "@mui/joy/Link";
import { AppBar } from "components";

function Home() {
    return (
        <>
            <AppBar
                link={[["Stage", "/stage/"]]}
                list={[["Stage", [["Main", "/stage/"]]]]}
                content={["Stage", "/stage/"]}
            />
            <Stack sx={{ p: 4, mx: "auto", alignItems: "center" }} spacing={4}>
                <Link
                    href="/stage/"
                    sx={{
                        backgroundImage: `url("${bannerImage}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "70vw",
                        aspectRatio: "3 / 1",
                        display: "block",
                        "&:hover": { textDecoration: "none" }
                    }}
                />
                <Stack spacing={1} direction="row" width="70vw">
                    <Stack
                        direction="column"
                        spacing={1}
                        divider={<Divider />}
                        width="64px"
                        border="1.5px solid"
                    >
                        와! 카페
                    </Stack>
                    <Stack
                        sx={{
                            alignItems: "center",
                            border: "1.5px solid",
                            borderColor: "black",
                            borderRadius: "sm",
                            p: 6
                        }}
                        spacing={3}
                    >
                        <Typography level="h3">프로젝트 108</Typography>
                        <Box sx={{ alignItems: "center" }}>
                            <Typography level="title-md">
                                이 프로젝트는 이해하기 어렵고 복잡한 과학 이론과 그 역사를 쉽고
                                재미있게 소개하는 프로젝트입니다.
                            </Typography>
                            <Typography level="title-md">
                                여러가지 창작물을 통해 과학 개념을 새로운 방식으로 보여주고 과학을
                                더욱 친근하게 전달해 줍니다.
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
}

export default Home;