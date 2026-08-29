/// <reference lib="webworker" />

import { AIFuncList } from "../utils/ai";

export interface AIRequest {
    aiType: string;
    fen: string;
}

export interface AIResponce {
    move: string | null;
}

const ctx: WorkerGlobalScope & typeof globalThis = self as any;

ctx.onmessage = (event: MessageEvent<AIRequest>) => {
    const { aiType, fen } = event.data;
    if (!Object.keys(AIFuncList).includes(aiType)) {
        ctx.postMessage({ move: null } as AIResponce);
    }
    const move = AIFuncList[aiType as keyof typeof AIFuncList](fen);
    ctx.postMessage({ move } as AIResponce);
};