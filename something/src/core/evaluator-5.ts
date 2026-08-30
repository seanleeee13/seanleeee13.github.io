import { Chess } from "ultrachess";

const INF_SCORE = 999999;
const SEARCH_DEPTH = 5;
const QUIESCENCE_MAX_DEPTH = 5;
const CENTER_PST = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 10, 10, 10, 10, 0, 0],
    [0, 0, 10, 20, 20, 10, 0, 0],
    [0, 0, 10, 20, 20, 10, 0, 0],
    [0, 0, 10, 10, 10, 10, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];
const PIECE_VALUES = { 0: 100, 1: 320, 2: 330, 3: 500, 4: 900, 5: 20000 };

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
        const toSquare = move.replace(/[+#]/g, "").slice(-2);
        const captured = chess.pieceAt(toSquare);
        return captured?.type ?? 0;
    } else {
        return 0;
    }
}

function sortMvvlva(moves: string[], chess: Chess) {
    if (moves.length <= 1) {
        return moves;
    }
    const scores = Array.from<number>({ length: moves.length });
    for (let i = 0; i < moves.length; i++) {
        if (moves[i].includes("x")) {
            scores[i] =
                PIECE_VALUES[getCaptured(moves[i], chess)] * 10 - PIECE_VALUES[getPiece(moves[i])];
        } else {
            scores[i] = -INF_SCORE;
        }
    }
    const moveIndices = Array.from({ length: moves.length }, (_, i) => i).toSorted(
        (a, b) => scores[b] - scores[a]
    );
    const sortedMoves = Array.from<string>({ length: moves.length });
    for (let i = 0; i < moves.length; i++) {
        sortedMoves[i] = moves[moveIndices[i]];
    }
    return sortedMoves;
}

function evaluateStatic(chess: Chess) {
    let score = 0;
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = board[r][c];
            if (!square) {
                continue;
            }
            score +=
                (PIECE_VALUES[square.type] + CENTER_PST[r][c]) *
                (square.color === chess.turn() ? 1 : -1);
        }
    }
    return score;
}

function quiescence(chess: Chess, alpha: number, beta: number, depth: number) {
    let standPat = evaluateStatic(chess);
    if (standPat >= beta) {
        return beta;
    }
    if (standPat > alpha) {
        alpha = standPat;
    }
    if (depth <= 0) {
        return alpha;
    }
    if (chess.isCheckmate()) {
        return chess.turn() === 0 ? -INF_SCORE : INF_SCORE;
    } else if (chess.isGameOver()) {
        return alpha;
    }
    const captureMoves = chess.moves().filter((move) => move.includes("x"));
    if (captureMoves.length === 0) {
        return alpha;
    }
    const sortedMoves = sortMvvlva(captureMoves, chess);
    for (const move of sortedMoves) {
        chess.move(move);
        const score = -quiescence(chess, -beta, -alpha, depth - 1);
        chess.undo();
        if (score > alpha) {
            alpha = score;
        }
        if (beta <= alpha) {
            break;
        }
    }
    return alpha;
}

function negamax(chess: Chess, depth: number, alpha: number, beta: number) {
    if (depth === 0) {
        return quiescence(chess, alpha, beta, QUIESCENCE_MAX_DEPTH);
    }
    if (chess.isCheckmate()) {
        return -INF_SCORE;
    } else if (chess.isGameOver()) {
        return evaluateStatic(chess);
    }
    const moves = sortMvvlva(chess.moves(), chess);
    let maxScore = -INF_SCORE;
    for (const move of moves) {
        chess.move(move);
        const score = -negamax(chess, depth - 1, -beta, -alpha);
        chess.undo();
        if (score > maxScore) {
            maxScore = score;
        }
        if (score > alpha) {
            alpha = score;
        }
        if (beta <= alpha) {
            break;
        }
    }
    return maxScore;
}

export default function getBestMove(fen: string) {
    const chess = Chess.createSync(fen);
    if (chess.isGameOver()) {
        return null;
    }
    const moves = sortMvvlva(chess.moves(), chess);
    let bestScore = -INF_SCORE;
    let bestMove: string | null = null;
    for (const move of moves) {
        chess.move(move);
        const score = -negamax(chess, SEARCH_DEPTH - 1, -INF_SCORE, -bestScore);
        chess.undo();
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}