import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Radio from "@mui/joy/Radio";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import RadioGroup from "@mui/joy/RadioGroup";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import backgroundImage from "../assets/bg.png";
import { AppBar } from "components";
import { Chessground } from "@lichess-org/chessground";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";
import type { Config } from "@lichess-org/chessground/config";
import { Chess, type Square } from "chess.js";
import { type Api } from "@lichess-org/chessground/api";
import { AIList } from "../utils/ai";
import { Card, Divider } from "@mui/joy";
import { keyframes } from "@emotion/react";

function PlaySelect() {
    const [color, setColor] = useState("random");
    const [p1, setP1] = useState("player");
    const [p2, setP2] = useState("Evaluator-5");
    const [_, setSearchParams] = useSearchParams();
    const handlePlay = () => {
        if (color === "" || p1 === "" || p2 === "") {
            return;
        }
        if (color === "random") {
            const isPlayerWhite = Math.random() < 0.5;
            if (isPlayerWhite) {
                setSearchParams({ white: p1, black: p2 });
            } else {
                setSearchParams({ white: p2, black: p1 });
            }
        } else {
            setSearchParams({ white: p1, black: p2 });
        }
    };
    return (
        <>
            <AppBar
                link={[
                    ["Something", "/something/"],
                    ["Play", "/something/#/play/"]
                ]}
                list={[
                    [
                        "Something",
                        [
                            ["Main", "/something/"],
                            ["Play", "/something/#/play/"],
                            ["Explore", "/something/#/explore/"]
                        ]
                    ]
                ]}
                content={["Something", "/something/"]}
            />
            <Box
                sx={{
                    backgroundImage: {
                        md: `linear-gradient(to right, black 40%, transparent 80%), url("${backgroundImage}")`,
                        sm: `linear-gradient(to bottom, black 60%, transparent 100%), url("${backgroundImage}")`
                    },
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    zIndex: -1000
                }}
            />
            <Box sx={{ overflowY: "auto", height: "calc(100vh - 64px)" }}>
                <Stack sx={{ p: 4, mx: "auto", my: 5, maxWidth: 1000 }} spacing={3}>
                    <Typography level="h1" textColor="common.white">
                        PLAY
                    </Typography>
                    <FormControl>
                        <FormLabel sx={{ color: "white" }}>Color</FormLabel>
                        <RadioGroup
                            value={color}
                            onChange={(event) => {
                                setColor(event.target.value);
                            }}
                        >
                            <Radio
                                value="random"
                                label="Random"
                                variant="outlined"
                                sx={{ color: "white" }}
                            />
                            <Radio
                                value="select"
                                label="Select"
                                variant="outlined"
                                sx={{ color: "white" }}
                            />
                        </RadioGroup>
                    </FormControl>
                    <Stack spacing={1} direction="column">
                        <Stack spacing={1} direction="row" alignItems="center">
                            <Typography level="title-md" textColor="common.white">
                                {color == "random" ? "P1:" : "White:"}
                            </Typography>
                            <Select
                                value={p1}
                                size="sm"
                                onChange={(__, newValue) => {
                                    setP1(newValue === null ? "" : newValue);
                                }}
                            >
                                <Option value="player">Player</Option>
                                {Object.entries(AIList).map(([id, name]) => (
                                    <Option value={id} key={`Option1-${id}`}>
                                        {name}
                                    </Option>
                                ))}
                            </Select>
                        </Stack>
                        <Stack spacing={1} direction="row" alignItems="center">
                            <Typography level="title-md" textColor="common.white">
                                {color == "random" ? "P2:" : "Black:"}
                            </Typography>
                            <Select
                                value={p2}
                                size="sm"
                                onChange={(__, newValue) => {
                                    setP2(newValue === null ? "" : newValue);
                                }}
                            >
                                <Option value="player">Player</Option>
                                {Object.entries(AIList).map(([id, name]) => (
                                    <Option value={id} key={`Option2-${id}`}>
                                        {name}
                                    </Option>
                                ))}
                            </Select>
                        </Stack>
                    </Stack>
                    <Button
                        sx={{
                            maxWidth: "10%",
                            transition: "transform 0.4s ease",
                            "&:hover": { transform: "scale(1.1)" }
                        }}
                        onClick={handlePlay}
                    >
                        Play
                    </Button>
                </Stack>
            </Box>
        </>
    );
}

function PlayChess() {
    const workerRef = useRef<Worker | null>(null);
    const [searchParams, _] = useSearchParams();
    const white = searchParams.get("white");
    const black = searchParams.get("black");
    const player = white === "player" ? "w" : black === "player" ? "b" : "none";
    let ai = null;
    if (player !== "none") {
        if (player === "w") {
            ai = black;
        } else {
            ai = white;
        }
    }
    const boardRef = useRef<HTMLDivElement>(null);
    const groundRef = useRef<Api>(null);
    const chessRef = useRef(new Chess());
    const navigate = useNavigate();
    const [promotionDialog, setPromotionDialog] = useState(false);
    const [promotionWhite, setPromotionWhite] = useState(false);
    const [promotionFile, setPromotionFile] = useState(0);
    const [promotion, setPromotion] = useState<{ from: Square; to: Square }>();
    const [hoveredSquare, setHoveredSquare] = useState(0);
    type endReasonType =
        | "none"
        | "white:checkmate"
        | "black:checkmate"
        | "draw:stalemate"
        | "draw:50moves"
        | "draw:repetition"
        | "draw:insufficientMaterials";
    const [endDialog, setEndDialog] = useState<endReasonType>("none");
    const winner: Record<endReasonType, string> = {
        none: "",
        "white:checkmate": `${white} 승리`,
        "black:checkmate": `${black} 승리`,
        "draw:stalemate": "무승부",
        "draw:50moves": "무승부",
        "draw:repetition": "무승부",
        "draw:insufficientMaterials": "무승부"
    };
    const reason: Record<endReasonType, string> = {
        none: "",
        "white:checkmate": `체크메이트`,
        "black:checkmate": `체크메이트`,
        "draw:stalemate": "스테일메이트",
        "draw:50moves": "50수 규칙",
        "draw:repetition": "반복",
        "draw:insufficientMaterials": "기물 부족"
    };
    const fadeIn = keyframes`
        from { opacity: 0; scale: 0 }
        to { opacity: 1; scale: 1 }
    `;
    const audioRefs = useRef<{
        move: HTMLAudioElement;
        capture: HTMLAudioElement;
        gameEnd: HTMLAudioElement;
    } | null>(null);
    useEffect(() => {
        const Move = new Audio("/something/assets/Move.mp3");
        const Capture = new Audio("/something/assets/Capture.mp3");
        const GameEnd = new Audio("/something/assets/GameEnd.mp3");
        audioRefs.current = {
            move: Move,
            capture: Capture,
            gameEnd: GameEnd
        };
    }, []);
    const getValidMoves = useCallback(() => {
        const dests = new Map<Square, Square[]>();
        const moves = chessRef.current.moves({ verbose: true });
        moves.forEach((m) => {
            if (!dests.has(m.from)) {
                dests.set(m.from, []);
            }
            dests.get(m.from)!.push(m.to);
        });
        return dests;
    }, []);
    const getValidPremoves = useCallback(() => {
        console.log(chessRef.current.turn());
        const premoveDests = new Map<Square, Square[]>();
        const board = chessRef.current.board();
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (piece && piece.color !== chessRef.current.turn()) {
                    const fromSquare = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
                    const chessBoard = new Chess();
                    chessBoard.clear();
                    chessBoard.setTurn(chessRef.current.turn() === "w" ? "b" : "w");
                    chessBoard.put({ type: piece.type, color: piece.color }, fromSquare);
                    if (piece.type === "p") {
                        const enemyColor = piece.color === "w" ? "b" : "w";
                        const dir = piece.color === "w" ? 1 : -1;
                        const nextRank = (8 - r) + dir;
                        if (c > 0) {
                            chessBoard.put({ type: "p", color: enemyColor }, `${String.fromCharCode(97 + c - 1)}${nextRank}` as Square);
                        }
                        if (c < 7) {
                            chessBoard.put({ type: "p", color: enemyColor }, `${String.fromCharCode(97 + c + 1)}${nextRank}` as Square);
                        }
                    }
                    if (piece.type === "k") {
                        const {k, q} = chessRef.current.getCastlingRights(piece.color);
                        const rookRank = piece.color === "w" ? 1 : 8;
                        if (k) {
                            chessBoard.put({ type: "r", color: piece.color }, `h${rookRank}`);
                        }
                        if (q) {
                            chessBoard.put({ type: "r", color: piece.color }, `a${rookRank}`);
                        }
                        chessBoard.setCastlingRights(piece.color, {k, q});
                    }
                    const moves = chessBoard.moves({ square: fromSquare, verbose: true });
                    moves.forEach((m) => {
                        if (!premoveDests.has(fromSquare)) {
                            premoveDests.set(fromSquare, []);
                        }
                        premoveDests.get(fromSquare)!.push(m.to);
                    });
                }
            }
        }
        console.log(premoveDests);
        console.log(chessRef.current.getCastlingRights("w"));
        return premoveDests;
    }, []);
    const handleGameEnd = useCallback(() => {
        groundRef.current?.cancelPremove();
        groundRef.current?.selectSquare(null, true);
        if (chessRef.current.isCheckmate()) {
            if (chessRef.current.turn() === "b") {
                setEndDialog("white:checkmate");
            } else {
                setEndDialog("black:checkmate");
            }
        } else if (chessRef.current.isStalemate()) {
            setEndDialog("draw:stalemate");
        } else if (chessRef.current.isDrawByFiftyMoves()) {
            setEndDialog("draw:50moves");
        } else if (chessRef.current.isThreefoldRepetition()) {
            setEndDialog("draw:repetition");
        } else if (chessRef.current.isInsufficientMaterial()) {
            setEndDialog("draw:insufficientMaterials");
        } else {
            setEndDialog("none");
        }
    }, []);
    useEffect(() => {
        const lightTile = "f0dab7";
        const darkTile = "b68863";
        const svgRaw = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xlink" viewBox="0 0 8 8" shape-rendering="crispEdges"><g id="a"><g id="b"><g id="c"><g id="d"><rect width="1" height="1" id="e" opacity="0" /><use x="1" y="1" href="#e" x:href="#e" /><rect y="1" width="1" height="1" id="f" fill="#${darkTile}" /><use x="1" y="-1" href="#f" x:href="#f" /></g><use x="2" href="#d" x:href="#d" /></g><use x="4" href="#c" x:href="#c" /></g><use y="2" href="#b" x:href="#b" /></g><use y="4" href="#a" x:href="#a" /></svg>`;
        const customSvgUrl = `url("data:image/svg+xml,${encodeURIComponent(svgRaw)}")`;
        const styleTag = document.createElement("style");
        styleTag.textContent = `cg-board { background-color: #${lightTile} !important; background-image: ${customSvgUrl} !important; }`;
        document.head.appendChild(styleTag);
        const config: Config = {
            coordinates: false,
            turnColor: "white",
            autoCastle: true,
            movable: {
                color: player === "none" ? undefined : player === "w" ? "white" : "black",
                free: false,
                dests: getValidMoves(),
                events: {
                    after: async (orig, dest) => {
                        const moves = chessRef.current.moves({ verbose: true });
                        const isPromotionMove = moves.some(
                            (m) => m.from === orig && m.to === dest && m.promotion
                        );
                        if (isPromotionMove) {
                            setPromotionDialog(true);
                            setPromotionWhite(chessRef.current.turn() == "w");
                            setPromotionFile(dest[0].charCodeAt(0) - 97);
                            setPromotion({ from: orig as Square, to: dest as Square });
                            return;
                        }
                        const moveResult = chessRef.current.move({
                            from: orig as Square,
                            to: dest as Square
                        });
                        groundRef.current?.set({
                            turnColor: chessRef.current.turn() === "w" ? "white" : "black",
                            movable: {
                                dests: getValidMoves()
                            },
                            premovable: {
                                customDests: getValidPremoves()
                            },
                            check: chessRef.current.isCheck(),
                            fen: chessRef.current.fen()
                        });
                        if (audioRefs.current) {
                            if (moveResult.captured) {
                                audioRefs.current.capture.currentTime = 0;
                                audioRefs.current.capture.play().catch((err) => {
                                    console.log("Audio error:", err);
                                });
                            } else {
                                audioRefs.current.move.currentTime = 0;
                                audioRefs.current.move.play().catch((err) => {
                                    console.log("Audio error:", err);
                                });
                            }
                        }
                        if (chessRef.current.isGameOver()) {
                            groundRef.current?.set({
                                viewOnly: true
                            });
                            setTimeout(() => {
                                if (audioRefs.current) {
                                    audioRefs.current.gameEnd.currentTime = 0;
                                    audioRefs.current.gameEnd.play().catch((err) => {
                                        console.log("Audio error:", err);
                                    });
                                }
                            }, 100);
                            setTimeout(handleGameEnd, 300);
                            return;
                        }
                        if (!ai) {
                            return;
                        }
                        workerRef.current?.postMessage(
                            { aiType: ai, fen: chessRef.current.fen() },
                            {}
                        );
                    }
                }
            },
            premovable: {
                enabled: true,
                showDests: true,
                castle: true,
                customDests: getValidPremoves(),
                additionalPremoveRequirements: () => {
                    return true;
                }
            },
            check: false,
            orientation: player === "b" ? "black" : "white"
        };
        if (boardRef.current) {
            groundRef.current = Chessground(boardRef.current, config);
        }
        return () => {
            styleTag.remove();
            if (groundRef.current) {
                groundRef.current.destroy();
            }
        };
    }, [groundRef, getValidMoves, player, getValidPremoves, ai, handleGameEnd]);
    const MoveAI = useCallback(
        (e: MessageEvent) => {
            const AIMove = e.data.move;
            if (!AIMove) {
                return;
            }
            const AIMoveResult = chessRef.current.move(AIMove);
            groundRef.current?.move(AIMoveResult.from, AIMoveResult.to);
            groundRef.current?.set({
                turnColor: chessRef.current.turn() === "w" ? "white" : "black",
                movable: {
                    dests: getValidMoves()
                },
                premovable: {
                    customDests: getValidPremoves()
                },
                check: chessRef.current.isCheck(),
                fen: chessRef.current.fen()
            });
            if (audioRefs.current) {
                if (AIMoveResult.captured) {
                    audioRefs.current.capture.currentTime = 0;
                    audioRefs.current.capture.play().catch((err) => {
                        console.log("Audio error:", err);
                    });
                } else {
                    audioRefs.current.move.currentTime = 0;
                    audioRefs.current.move.play().catch((err) => {
                        console.log("Audio error:", err);
                    });
                }
            }
            if (chessRef.current.isGameOver()) {
                groundRef.current?.set({
                    viewOnly: true
                });
                setTimeout(() => {
                    if (audioRefs.current) {
                        audioRefs.current.gameEnd.currentTime = 0;
                        audioRefs.current.gameEnd.play().catch((err) => {
                            console.log("Audio error:", err);
                        });
                    }
                }, 100);
                setTimeout(handleGameEnd, 300);
                return;
            }
            const currentPremove = groundRef.current?.state.premovable.current;
            if (currentPremove) {
                const [orig, dest] = currentPremove;
                const isLegal = chessRef.current
                    .moves({ verbose: true })
                    .some((m) => m.from === orig && m.to === dest);
                if (isLegal) {
                    if (groundRef.current) {
                        setTimeout(groundRef.current.playPremove, 100);
                    }
                } else {
                    groundRef.current?.cancelPremove();
                }
            }
        },
        [getValidMoves, getValidPremoves, handleGameEnd]
    );
    useEffect(() => {
        const worker = new Worker(new URL("../core/core.worker.ts", import.meta.url), {
            type: "module"
        });
        workerRef.current = worker;
        workerRef.current?.addEventListener("message", MoveAI);
        return () => {
            workerRef.current?.removeEventListener("message", MoveAI);
            worker.terminate();
            workerRef.current = null;
        };
    }, [MoveAI]);
    useEffect(() => {
        if (white !== "player" && black === "player") {
            workerRef.current?.postMessage({ aiType: ai, fen: chessRef.current.fen() }, {});
        }
    }, [white, black, ai]);
    if (ai && !Object.keys(AIList).includes(ai)) {
        return null;
    }
    if (white === "player" && black === "player") {
        return "WHAT";
    }
    const handlePromotionSelect = (piece: "q" | "n" | "r" | "b") => {
        if (!promotion) {
            return;
        }
        const move = { ...promotion, promotion: piece };
        const moveResult = chessRef.current.move(move);
        if (!groundRef.current) {
            return;
        }
        groundRef.current.set({
            turnColor: chessRef.current.turn() === "w" ? "white" : "black",
            fen: chessRef.current.fen(),
            movable: {
                dests: getValidMoves()
            },
            premovable: {
                customDests: getValidPremoves()
            },
            check: chessRef.current.isCheck()
        });
        if (audioRefs.current) {
            if (moveResult.captured) {
                audioRefs.current.capture.currentTime = 0;
                audioRefs.current.capture.play().catch((err) => {
                    console.log("Audio error:", err);
                });
            } else {
                audioRefs.current.move.currentTime = 0;
                audioRefs.current.move.play().catch((err) => {
                    console.log("Audio error:", err);
                });
            }
        }
        setPromotionDialog(false);
        workerRef.current?.postMessage({ aiType: ai, fen: chessRef.current.fen() }, {});
    };
    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            <AppBar
                link={[
                    ["Something", "/something/"],
                    ["Play", "/something/#/play/"]
                ]}
                list={[
                    [
                        "Something",
                        [
                            ["Main", "/something/"],
                            ["Play", "/something/#/play/"],
                            ["Explore", "/something/#/explore/"]
                        ]
                    ]
                ]}
                content={["Something", "/something/"]}
            />
            <Stack
                sx={{ p: 4, mx: "auto", maxWidth: 1000, height: "calc(100vh - 64px)" }}
                alignItems="center"
                spacing={10}
            >
                <Typography level="h1">PLAY</Typography>
                <div
                    style={{
                        margin: "10px",
                        aspectRatio: "1 / 1",
                        height: "calc((100vh - 64px) / 5 * 4)",
                        position: "relative"
                    }}
                >
                    <div
                        ref={boardRef}
                        className="chessground"
                        style={{
                            margin: 0,
                            aspectRatio: "1 / 1",
                            height: "calc((100vh - 64px) / 5 * 4)",
                            zIndex: 100,
                            position: "absolute"
                        }}
                    />
                    {endDialog !== "none" && (
                        <Box
                            sx={{
                                background: "rgba(255, 255, 255, 0.7)",
                                zIndex: 102,
                                position: "absolute",
                                aspectRatio: "1 / 1",
                                height: "calc((100vh - 64px) / 5 * 4)",
                                justifyContent: "center",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <Card
                                sx={{
                                    alignItems: "center",
                                    p: 0,
                                    animation: `${fadeIn} 0.5s ease-out forwards`
                                }}
                            >
                                <Stack direction="column" spacing={2} alignItems="center">
                                    <Stack
                                        direction="column"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{ px: "16px", pb: 0, pt: "16px" }}
                                    >
                                        <Typography level="h2">{winner[endDialog]}</Typography>
                                        <Typography level="title-lg" color="neutral">
                                            {reason[endDialog]}
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{ px: "16px", pb: "16px", pt: 0 }}
                                    >
                                        <Button
                                            variant="solid"
                                            onClick={() => {
                                                window.location.reload();
                                            }}
                                        >
                                            재대국
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                navigate("/play/");
                                            }}
                                        >
                                            신규 봇
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Box>
                    )}
                    {promotionDialog && (
                        <div
                            style={{
                                background: "rgba(255, 255, 255, 0.7)",
                                zIndex: 101,
                                position: "absolute",
                                aspectRatio: "1 / 1",
                                height: "calc((100vh - 64px) / 5 * 4)"
                            }}
                            onClick={() => {
                                setPromotionDialog(false);
                                groundRef.current?.set({
                                    fen: chessRef.current.fen(),
                                    lastMove: [],
                                    turnColor: promotionWhite ? "white" : "black",
                                    movable: {
                                        dests: getValidMoves()
                                    },
                                    premovable: {
                                        customDests: getValidPremoves()
                                    },
                                    check: chessRef.current.isCheck()
                                });
                                console.log(groundRef.current?.state);
                            }}
                        >
                            <span
                                style={{
                                    top: "0%",
                                    left: `${
                                        promotionWhite
                                            ? promotionFile * 12.5
                                            : 87.5 - promotionFile * 12.5
                                    }%`,
                                    transition: "all 150ms ease",
                                    cursor: "pointer",
                                    borderRadius: hoveredSquare === 1 ? "0%" : "50%",
                                    backgroundColor: "#b0b0b0",
                                    boxShadow:
                                        hoveredSquare === 1
                                            ? "inset 0 0 48px 8px hsl(22 100% 42%)"
                                            : "inset 0 0 25px 3px gray",
                                    pointerEvents: "all",
                                    position: "absolute",
                                    width: "12.5%",
                                    height: "12.5%"
                                }}
                                onMouseEnter={() => setHoveredSquare(1)}
                                onMouseLeave={() => hoveredSquare === 1 && setHoveredSquare(0)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePromotionSelect("q");
                                }}
                            >
                                <span
                                    style={{
                                        transition: "all 150ms ease",
                                        width: "100%",
                                        height: "100%",
                                        transform: hoveredSquare === 1 ? "none" : "scale(0.8)",
                                        pointerEvents: "none",
                                        opacity: 1,
                                        left: 0,
                                        top: 0,
                                        position: "absolute",
                                        backgroundSize: "cover",
                                        willChange: "transform",
                                        backgroundImage: promotionWhite
                                            ? `url(/something/assets/white-queen.svg)`
                                            : `url(/something/assets/black-queen.svg)`
                                    }}
                                />
                            </span>
                            <span
                                style={{
                                    top: "12.5%",
                                    left: `${promotionWhite ? promotionFile * 12.5 : 87.5 - promotionFile * 12.5}%`,
                                    transition: "all 150ms ease",
                                    cursor: "pointer",
                                    borderRadius: hoveredSquare === 2 ? "0%" : "50%",
                                    backgroundColor: "#b0b0b0",
                                    boxShadow:
                                        hoveredSquare === 2
                                            ? "inset 0 0 48px 8px hsl(22 100% 42%)"
                                            : "inset 0 0 25px 3px gray",
                                    pointerEvents: "all",
                                    position: "absolute",
                                    width: "12.5%",
                                    height: "12.5%"
                                }}
                                onMouseEnter={() => setHoveredSquare(2)}
                                onMouseLeave={() => hoveredSquare === 2 && setHoveredSquare(0)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePromotionSelect("n");
                                }}
                            >
                                <span
                                    style={{
                                        transition: "all 150ms ease",
                                        width: "100%",
                                        height: "100%",
                                        transform: hoveredSquare === 2 ? "none" : "scale(0.8)",
                                        pointerEvents: "none",
                                        opacity: 1,
                                        left: 0,
                                        top: 0,
                                        position: "absolute",
                                        backgroundSize: "cover",
                                        willChange: "transform",
                                        backgroundImage: promotionWhite
                                            ? `url(/something/assets/white-knight.svg)`
                                            : `url(/something/assets/black-knight.svg)`
                                    }}
                                />
                            </span>
                            <span
                                style={{
                                    top: "25%",
                                    left: `${promotionWhite ? promotionFile * 12.5 : 87.5 - promotionFile * 12.5}%`,
                                    transition: "all 150ms ease",
                                    cursor: "pointer",
                                    borderRadius: hoveredSquare === 3 ? "0%" : "50%",
                                    backgroundColor: "#b0b0b0",
                                    boxShadow:
                                        hoveredSquare === 3
                                            ? "inset 0 0 48px 8px hsl(22 100% 42%)"
                                            : "inset 0 0 25px 3px gray",
                                    pointerEvents: "all",
                                    position: "absolute",
                                    width: "12.5%",
                                    height: "12.5%"
                                }}
                                onMouseEnter={() => setHoveredSquare(3)}
                                onMouseLeave={() => hoveredSquare === 3 && setHoveredSquare(0)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePromotionSelect("r");
                                }}
                            >
                                <span
                                    style={{
                                        transition: "all 150ms ease",
                                        width: "100%",
                                        height: "100%",
                                        transform: hoveredSquare === 3 ? "none" : "scale(0.8)",
                                        pointerEvents: "none",
                                        opacity: 1,
                                        left: 0,
                                        top: 0,
                                        position: "absolute",
                                        backgroundSize: "cover",
                                        willChange: "transform",
                                        backgroundImage: promotionWhite
                                            ? `url(/something/assets/white-rook.svg)`
                                            : `url(/something/assets/black-rook.svg)`
                                    }}
                                />
                            </span>
                            <span
                                style={{
                                    top: "37.5%",
                                    left: `${promotionWhite ? promotionFile * 12.5 : 87.5 - promotionFile * 12.5}%`,
                                    transition: "all 150ms ease",
                                    cursor: "pointer",
                                    borderRadius: hoveredSquare === 4 ? "0%" : "50%",
                                    backgroundColor: "#b0b0b0",
                                    boxShadow:
                                        hoveredSquare === 4
                                            ? "inset 0 0 48px 8px hsl(22 100% 42%)"
                                            : "inset 0 0 25px 3px gray",
                                    pointerEvents: "all",
                                    position: "absolute",
                                    width: "12.5%",
                                    height: "12.5%"
                                }}
                                onMouseEnter={() => setHoveredSquare(4)}
                                onMouseLeave={() => hoveredSquare === 4 && setHoveredSquare(0)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePromotionSelect("b");
                                }}
                            >
                                <span
                                    style={{
                                        transition: "all 150ms ease",
                                        width: "100%",
                                        height: "100%",
                                        transform: hoveredSquare === 4 ? "none" : "scale(0.8)",
                                        pointerEvents: "none",
                                        opacity: 1,
                                        left: 0,
                                        top: 0,
                                        position: "absolute",
                                        backgroundSize: "cover",
                                        willChange: "transform",
                                        backgroundImage: promotionWhite
                                            ? `url(/something/assets/white-bishop.svg)`
                                            : `url(/something/assets/black-bishop.svg)`
                                    }}
                                />
                            </span>
                        </div>
                    )}
                </div>
            </Stack>
        </div>
    );
}

function Play() {
    const [searchParams, _] = useSearchParams();
    const white = searchParams.get("white");
    const black = searchParams.get("black");
    if (white === null || black === null) {
        return <PlaySelect />;
    } else {
        return <PlayChess />;
    }
}

export default Play;