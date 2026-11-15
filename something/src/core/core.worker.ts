/// <reference lib="webworker" />

import { AIFuncList } from "../utils/ai";
import { init } from "ultrachess";

export interface AIRequest {
    aiType: string;
    movesHistory: string[];
    initialFen?: string | undefined;
}

export interface AIResponse {
    move: string | null;
}

const ctx: WorkerGlobalScope & typeof globalThis = self as unknown as WorkerGlobalScope &
    typeof globalThis;

const initPromise = init();

ctx.addEventListener("message", async (event: MessageEvent<AIRequest>) => {
    const { aiType, movesHistory, initialFen } = event.data;
    await initPromise;
    if (!Object.keys(AIFuncList).includes(aiType)) {
        ctx.postMessage({ move: null } as AIResponse, {});
        return;
    }
    const move = AIFuncList[aiType as keyof typeof AIFuncList](movesHistory, initialFen);
    ctx.postMessage({ move } as AIResponse, {});
});