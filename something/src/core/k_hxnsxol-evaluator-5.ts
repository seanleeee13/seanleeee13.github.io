import { Chess } from "ultrachess/inline";

const INF_SCORE = 999999;
const SEARCH_DEPTH = 4;
const QUIESCENCE_MAX_DEPTH = 4;
const CENTER_PST = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 10, 10, 10, 10, 0, 0],
    [0, 0, 10, 20, 20, 10, 0, 0],
    [0, 0, 10, 20, 20, 10, 0, 0],
    [0, 0, 10, 10, 10, 10, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];
const PIECE_VALUES = { 0: 100, 1: 320, 2: 330, 3: 500, 4: 900, 5: 20000 };

function getPiece(move: string) {
    switch (move[0]) {
        case "N":
            return 1;
        case "B":
            return 2;
        case "R":
            return 3;
        case "Q":
            return 4;
        case "K":
        case "O":
            return 5;
        default:
            return 0;
    }
}

function getCapured(move: string, chess: Chess) {
    if (move.includes("x", 1)) {
        const toSquare = move.replace(/[+#]/g, "").slice(-2);
        const captured = chess.pieceAt(toSquare);
        return captured?.type ?? 0;
    } else {
        return 0;
    }
}

function sortMvvlva(moves: string[], chess: Chess) {
    const scoreMap = new Map<string, number>();
    for (let i = 0; i < moves.length; i++) {
        const m = moves[i];
        const score = m.includes("x")
            ? PIECE_VALUES[getCapured(m, chess)] * 10 - PIECE_VALUES[getPiece(m)]
            : -INF_SCORE;
        scoreMap.set(m, score);
    }
    return moves.toSorted((a, b) => {
        const aScore = scoreMap.get(a)!;
        const bScore = scoreMap.get(b)!;
        if (aScore === bScore) {
            return 0;
        } else {
            return bScore - aScore;
        }
    });
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
    const captureMoves = sortMvvlva(
        chess.moves().filter((move) => move.includes("x")),
        chess,
    );
    if (depth <= 0 || captureMoves.length === 0) {
        return alpha;
    }
    if (chess.isCheckmate()) {
        return chess.turn() === 0 ? -INF_SCORE : INF_SCORE;
    } else if (chess.isGameOver()) {
        return alpha;
    }
    for (const move of captureMoves) {
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
        const score = -negamax(chess, SEARCH_DEPTH - 1, -INF_SCORE, INF_SCORE);
        chess.undo();
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}