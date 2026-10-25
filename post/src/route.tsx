import { createHashRouter, RouterProvider, useNavigate, useParams } from "react-router";
import { AppBar } from "components";
import { getContents, usable } from "components/utils";
import { useEffect, useState } from "react";
import { Box, Link, Select, Stack, Table, Typography, Option } from "@mui/joy";

function Home() {
    const { contents } = useParams<{ contents: string }>();
    const [contentsSelection, setContentsSelection] = useState<string>(contents ?? "");
    const filePaths = import.meta.glob('./posts/**/*.tsx', { eager: true });
    const fileList = Object.entries(filePaths);
    const folderedFiles = fileList.reduce((prev, [path, module]) => ({
        ...(prev),
        [path.split("/").at(-2) as string]: [...(prev[path.split("/").at(-2) as string] ?? []), [+(path.split("/").at(-1)?.split(".")[0] ?? ""), (module as Record<string, unknown>).title] as [number, string]]
    }), {} as Record<string, [number, string][]>);
    const [content, setContent] = useState<[string, string][]>(usable);
    const navigate = useNavigate();
    useEffect(() => {
        const getContent = async () => {
            setContent(await getContents());
        };
        getContent();
    }, []);
    const orderMap = Object.fromEntries([["main", "Main"], ...content].map((val, idx) => [val[0], idx]));
    return (
        <>
            <AppBar
                link={[]}
                list={[
                    ["컨텐츠", content.map(([id, name]) => [name, `/${id}/`])],
                    ["공통 기능", [["Posts", "/post/"], ["Log Out", "/#/logout/"]]]
                ]}
            />
            <Box
                sx={{
                    overflowY: "auto",
                    height: "calc(100vh - 64px)",
                    scrollbarGutter: "stable both-edges"
                }}
            >
                <Stack
                    direction="column"
                    spacing={2}
                    sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }}
                >
                    <Select value={contentsSelection} sx={{ maxWidth: "300px" }} onChange={(_, newValue) => { setContentsSelection(newValue ?? ""); navigate(newValue ? `/${newValue}/` : "/"); }}>
                        <Option value="">Show All</Option>
                        {[["main", "Main"], ...content].map(text => (
                            <Option key={`option-${text[0]}`} value={text[0]}>{text[1]}</Option>
                        ))}
                    </Select>
                    <Typography level="h1">글 목록</Typography>
                    <Table>
                        <thead>
                            <tr>
                                <th style={{ width: "10%"}}>Contents</th>
                                <th style={{ width: "5%"}}>ID</th>
                                <th style={{ width: "85%"}}>Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(folderedFiles)
                                .toSorted((a, b) => ((orderMap[a[0]] ?? Infinity) - (orderMap[b[0]] ?? Infinity)))
                                .filter(text => orderMap[text[0]] !== undefined)
                                .filter(text => !contents || text[0] === contents)
                                .map(text => (
                                    text[1]
                                        .toSorted((a, b) => a[0] - b[0])
                                        .map(obj => [[["main", "Main"], ...content].find(textObj => textObj[0] === text[0]), ...obj] as [[string, string], number, string])
                                ))
                                .flat()
                                .map(text => (
                                    <tr key={`tr-${text[0][0]}-${text[1]}`}>
                                        <th><Link textColor="common.black" href={`#/${text[0][0]}/`} onClick={() => { setContentsSelection(text[0][0]); }}>{text[0][1]}</Link></th>
                                        <th>{text[1]}</th>
                                        <th><Link textColor="common.black" href={`#/${text[0][0]}/${text[1]}/`}>{text[2]}</Link></th>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </Stack>
            </Box>
        </>
    );
}

function RoutePost() {
    const { contents, post_id } = useParams<{ contents: string; post_id: string }>();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<React.ReactNode | null>(null);
    const [content, setContent] = useState<[string, string][]>(usable);
    useEffect(() => {
        const getPost = async () => {
            const contentList = await getContents();
            setContent(contentList);
            if (![["main", "Main"], ...contentList].find(val => val[0] === contents)) {
                return;
            }
            const module = await import(`./posts/${contents}/${post_id}.tsx`);
            setLoading(false);
            setPost(module.default);
        };
        getPost();
    }, [contents, post_id]);
    if (loading) {
        return;
    }
    return (
        <>
            <AppBar
                link={[]}
                list={[
                    ["컨텐츠", content.map(([id, name]) => [name, `/${id}/`])],
                    ["공통 기능", [["Posts", "/post/"], ["Log Out", "/#/logout/"]]]
                ]}
            />
            {post}
        </>
    );
}

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/:contents", element: <Home /> },
    { path: "/:contents/:post_id", element: <RoutePost /> }
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;