import { Chess, moveToUci } from "ultrachess/inline";

const INF_SCORE = 999999;
const CENTER_PST = [
    [0, 1,  4,  3,  0,  3, 5, 1],
    [0, 0,  0,  2,  2,  0, 0, 0],
    [0, 0, 11, 10, 10, 13, 0, 0],
    [0, 0, 12, 25, 20, 11, 0, 0],
    [0, 0, 12, 25, 20, 11, 0, 0],
    [0, 0, 11, 10, 10, 13, 0, 0],
    [0, 0,  0,  2,  2,  0, 0, 0],
    [0, 1,  4,  3,  0,  3, 5, 1]
];
const PAWN_CENTER_PST = [
    [999,999,999,999,999,999,999,999],
    [  3,  3,  3,  0,  0,  3,  3,  3],
    [  2,  2,  7,  8, 10,  2,  2,  2],
    [  2,  1, 10, 13, 30,  4,  1,  2],
    [  2,  1, 10, 13, 30,  4,  1,  2],
    [  2,  2,  7,  8, 10,  2,  2,  2],
    [  3,  3,  3,  0,  0,  3,  3,  3],
    [999,999,999,999,999,999,999,999]
];
const PIECE_VALUES = { 0: 100, 1: 320, 2: 330, 3: 500, 4: 900, 5: 20000 };
const PIECE_MAP = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }
const SAFE_MOBILITY_WEIGHTS = {
    0: 5,
    1: 6,
    2: 4,
    3: 4,
    4: 1,
    5: 0
};
const KNIGHT_DIRS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const BISHOP_DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const ROOK_DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const QUEEN_DIRS = [...BISHOP_DIRS, ...ROOK_DIRS];

function mulberry32(seed: number) {
    let t = seed += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function createSeed(fen: string, san: string) {
    const str = `${san}|${fen}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 7) - hash) ^ (hash >>> 3) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}

function getPiece(move: string) {
    const firstChar = move.charCodeAt(0);
    if (firstChar === 78) return 1;
    if (firstChar === 66) return 2;
    if (firstChar === 82) return 3;
    if (firstChar === 81) return 4;
    if (firstChar === 75 || firstChar === 79) return 5;
    return 0;
}

function getCaptured(move: string, chess: Chess) {
    if (move.includes("x", 1)) {
        const toSquare = move.replace(/[+#]|(=?[A-Za-z])$/g, "").slice(-2);
        const captured = chess.pieceAt(toSquare);
        return captured?.type ?? 0;
    } else {
        return 0;
    }
}

function sortMvvlva(moves: string[], chess: Chess, priorityMoves: string[] = []) {
    if (moves.length <= 1) return moves;
    const fen = chess.fen();
    const moveObjects = moves.map((move) => {
        const priorityIdx = priorityMoves.indexOf(move);
        if (priorityIdx !== -1) {
            return { move, score: INF_SCORE * 2 - priorityIdx * 100 };
        }
        let score = move.includes("x")
            ? PIECE_VALUES[getCaptured(move, chess)] * 10 - PIECE_VALUES[getPiece(move)]
            : -INF_SCORE;
        if (move.includes("=")) score += 900;
        else {
            if (move.includes("+")) score += 500;
            if (move.includes("#")) score += INF_SCORE * 3;
            if (move.startsWith("O-O")) score += 700;
        }
        score += mulberry32(createSeed(move, fen)) - 0.5;
        return { move, score };
    });
    moveObjects.sort((a, b) => b.score - a.score);
    return moveObjects.map((item) => item.move);
}

function isAttackedByEnemyPawn(board: any[][], r: number, c: number, color: number): boolean {
    const enemyRow = color === 0 ? r - 1 : r + 1;
    if (enemyRow < 0 || enemyRow > 7) return false;
    const enemyColor = color === 0 ? 1 : 0;
    const left = c > 0 ? board[enemyRow][c - 1] : null;
    const right = c < 7 ? board[enemyRow][c + 1] : null;
    return (
        (left?.type === 0 && left?.color === enemyColor) ||
        (right?.type === 0 && right?.color === enemyColor)
    );
}

function getSafeMobility(board: any[][], r: number, c: number, type: number, color: number): number {
    if (type === 5) return 0;
    let mobilityScore = 0;
    if (type === 0) {
        const nextR = color === 0 ? r - 1 : r + 1;
        if (nextR >= 0 && nextR < 8 && !board[nextR][c] && !isAttackedByEnemyPawn(board, nextR, c, color)) {
            mobilityScore += 1 + PAWN_CENTER_PST[nextR][c] * 0.1;
        }
        return mobilityScore;
    }
    if (type === 1) {
        for (const [dr, dc] of KNIGHT_DIRS) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                const target = board[nr][nc];
                if ((!target || target.color !== color) && !isAttackedByEnemyPawn(board, nr, nc, color)) {
                    mobilityScore += 1 + CENTER_PST[nr][nc] * 0.1;
                }
            }
        }
        return mobilityScore;
    }
    const dirs = type === 2 ? BISHOP_DIRS : type === 3 ? ROOK_DIRS : QUEEN_DIRS;
    for (const [dr, dc] of dirs) {
        let nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = board[nr][nc];
            if (target) {
                if (target.color !== color && !isAttackedByEnemyPawn(board, nr, nc, color)) {
                    mobilityScore += 1 + CENTER_PST[nr][nc] * 0.1;
                }
                break;
            }
            if (!isAttackedByEnemyPawn(board, nr, nc, color)) {
                mobilityScore += 1 + CENTER_PST[nr][nc] * 0.1;
            }
            nr += dr;
            nc += dc;
        }
    }
    return mobilityScore;
}

function evaluateStatic(chess: Chess) {
    let score = 0;
    const board = chess.board();
    const turn = chess.turn();
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = board[r][c];
            if (!square) {
                continue;
            }
            const safeMobility = getSafeMobility(board, r, c, square.type, square.color);
            const pieceScore =
                PIECE_VALUES[square.type] +
                1.5 * (square.type === 0 ? PAWN_CENTER_PST : CENTER_PST)[r][c] +
                0.05 * safeMobility * SAFE_MOBILITY_WEIGHTS[square.type as keyof typeof SAFE_MOBILITY_WEIGHTS];
            score += pieceScore * (square.color === turn ? 1 : -1);
        }
    }
    return score;
}

function quiescence(
    chess: Chess,
    alpha: number,
    beta: number,
    depth: number,
    currentDepth: number,
    stats: { nodes: number, startTime: number, nodesLimit?: number, movetime?: number },
    maxDepth: number
) {
    stats.nodes += 1;
    let standPat = evaluateStatic(chess);
    let minDepth = depth;
    let pv: string[] = [];
    if (chess.isCheckmate()) {
        return { score: -INF_SCORE + currentDepth + maxDepth - depth, minDepth, pv };
    }
    if (standPat > alpha) {
        alpha = standPat;
    }
    if (depth <= 0) {
        return { score: alpha, minDepth, pv };
    }
    if (chess.isGameOver()) {
        return { score: alpha, minDepth, pv };
    }
    let captureMoves;
    const moves = chess.moves();
    if (
        moves.length <= 50
        && (
            chess.board().flat().filter((sq) => sq !== null).length <= 7
            || moves.length <= 15
            || chess.inCheck()
        )
    ) {
        captureMoves = moves;
    } else {
        if (standPat >= beta) {
            return { score: beta, minDepth, pv };
        }
        captureMoves = moves.filter((move) => (
            move.includes("x")
            || move.includes("=")
            || move.includes("+")
            || move.includes("#")
        ));
    }
    if (captureMoves.length === 0) {
        return { score: alpha, minDepth, pv };
    }
    const sortedMoves = sortMvvlva(captureMoves, chess);
    for (const move of sortedMoves) {
        chess.move(move);
        const { score: mscore, minDepth: ndepth, pv: npv } = quiescence(
            chess,
            -beta,
            -alpha,
            depth - 1,
            currentDepth,
            stats,
            maxDepth
        );
        const score = -mscore;
        minDepth = Math.min(ndepth, minDepth);
        chess.undo();
        if (score > alpha) {
            alpha = score;
            pv = [move, ...npv];
        }
        if (beta <= alpha) {
            break;
        }
    }
    return { score: alpha, minDepth, pv };
}

function negamax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    stats: { nodes: number, startTime: number, nodesLimit?: number, movetime?: number },
    currentDepth: number,
    matchedLine: string[],
    quiescenceDepth: number
) {
    stats.nodes += 1;
    const ply = currentDepth - depth;
    let pv: string[] = [];
    if (depth === 0) {
        return quiescence(chess, alpha, beta, quiescenceDepth, currentDepth, stats, quiescenceDepth);
    }
    if (chess.isCheckmate()) {
        return { score: -INF_SCORE + ply + 1, minDepth: currentDepth, pv };
    } else if (chess.isGameOver()) {
        return { score: 0, minDepth: currentDepth, pv };
    }
    const priority = matchedLine[ply] ? [matchedLine[ply]] : [];
    const moves = sortMvvlva(chess.moves(), chess, priority);
    let maxScore = -INF_SCORE;
    let minDepth = quiescenceDepth + 1;
    for (const move of moves) {
        chess.move(move);
        const nextMatchedLine = move === matchedLine[ply] ? matchedLine : [];
        let { score: mscore, minDepth: ndepth, pv: npv } = negamax(
            chess,
            depth - 1,
            -beta,
            -alpha,
            stats,
            currentDepth,
            nextMatchedLine,
            quiescenceDepth
        );
        const score = -mscore;
        minDepth = Math.min(ndepth, minDepth);
        chess.undo();
        if (score > maxScore) {
            maxScore = score;
        }
        if (score > alpha) {
            alpha = score;
            pv = [move, ...npv];
        }
        if (beta <= alpha) {
            break;
        }
    }
    return { score: maxScore, minDepth: minDepth, pv };
}

export default function getBestMove(
    movesHistory: string[],
    initialFen?: string
) {
    console.log(movesHistory, initialFen);
    const chess = Chess.createSync(initialFen);
    for (const move of movesHistory) {
        chess.move(move);
    }
    if (chess.isGameOver()) {
        return null;
    }
    let moves = chess.moves();
    const startTime = performance.now();
    const stats: { nodes: number, startTime: number, nodesLimit?: number, movetime?: number } = {
        nodes: 1,
        startTime
    };
    moves = sortMvvlva(moves, chess);
    const sortedMoves = sortMvvlva(moves, chess);
    let bestMove = moveToUci(chess.parseSan(sortedMoves[0]));
    let pv: [string[], number][] = sortedMoves.map((x) => [[x], 0]);
    try {
        let currentDepth = 1;
        while (true) {
            let quiescenceDepth = Math.max(currentDepth, 5);
            let maxDepth = currentDepth;
            let currentTopPvs: [string[], number][] = [];
            let top2eval: [number, number] = [-INF_SCORE * 2, -INF_SCORE * 2];
            for (const [[move]] of pv) {
                const alpha = currentTopPvs.length === 0
                    ? -INF_SCORE * 2
                    : currentTopPvs[0][1];
                const matchedEntry = pv.find(([line]) => line[0] === move);
                const matchedLine = matchedEntry ? matchedEntry[0] : [];
                chess.move(move);
                let mscore, minDepth, npv;
                if (currentTopPvs.length < 8 || currentDepth < 3) {
                    ({ score: mscore, minDepth, pv: npv } = negamax(
                        chess,
                        currentDepth - 1,
                        -INF_SCORE * 2,
                        -alpha,
                        stats,
                        currentDepth,
                        matchedLine,
                        quiescenceDepth
                    ));
                } else {
                    ({ score: mscore, minDepth, pv: npv } = negamax(
                        chess,
                        currentDepth - 2,
                        -INF_SCORE * 2,
                        -alpha,
                        stats,
                        currentDepth,
                        matchedLine,
                        quiescenceDepth
                    ));
                    if (-mscore > alpha) {
                        ({ score: mscore, minDepth, pv: npv } = negamax(
                            chess,
                            currentDepth - 1,
                            -INF_SCORE * 2,
                            -alpha,
                            stats,
                            currentDepth,
                            matchedLine,
                            quiescenceDepth
                        ));
                    }
                }
                chess.undo();
                const score = -mscore;
                maxDepth = Math.max(maxDepth, currentDepth + quiescenceDepth - minDepth);
                if (score > alpha) {
                    currentTopPvs.push([[move, ...npv], score]);
                    currentTopPvs.sort(([, s1], [, s2]) => s2 - s1);
                    if (currentTopPvs.length > 1) {
                        currentTopPvs.pop();
                    }
                }
                if (score > top2eval[0]) {
                    top2eval = [score, top2eval[0]];
                } else if (score > top2eval[1]) {
                    top2eval[1] = score;
                }
            }
            pv = currentTopPvs;
            bestMove = moveToUci(chess.parseSan(pv[0][0][0]));
            if (currentDepth >= 5) {
                break;
            }
            currentDepth++;
        }
    } catch {
        return bestMove;
    }
    return bestMove;
}