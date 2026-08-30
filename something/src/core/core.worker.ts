/// <reference lib="webworker" />

import { AIFuncList } from "../utils/ai";
import { init } from "ultrachess";

export interface AIRequest {
    aiType: string;
    fen: string;
}

export interface AIResponse {
    move: string | null;
}

const ctx: WorkerGlobalScope & typeof globalThis = self as unknown as WorkerGlobalScope &
    typeof globalThis;

init().then(() => {
    ctx.addEventListener("message", (event: MessageEvent<AIRequest>) => {
        const { aiType, fen } = event.data;
        if (!Object.keys(AIFuncList).includes(aiType)) {
            ctx.postMessage({ move: null } as AIResponse, {});
        }
        const move = AIFuncList[aiType as keyof typeof AIFuncList](fen);
        ctx.postMessage({ move } as AIResponse, {});
    });
});