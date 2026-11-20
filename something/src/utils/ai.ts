import { default as evaluator_5 } from "../core/evaluator-5";
import { default as evaluatorx_6 } from "../core/evaluaorx-6";

export const AIList = {
    "Evaluator-5": "Evaluator-5",
    "EvaluatorX-6": "EvaluatorX-6"
};
export const AIFuncList = {
    "Evaluator-5": evaluator_5,
    "EvaluatorX-6": evaluatorx_6
};
export const AIDataList = [
    {
        id: "Evaluator-5",
        name: "Evaluator-5",
        developer: ["k_hxnsxol"],
        version: "1.0",
        depth: 5,
        algorithm: "Negamax",
        elo: 1500,
        description: "Just a normal AI"
    },
    {
        id: "EvaluatorX-6",
        name: "EvaluatorX-6",
        developer: ["seanleeee13", "k_hxnsxol"],
        version: "2.0",
        depth: 6,
        algorithm: "Negamax",
        elo: 1508,
        description: "Now with LMR"
    }
];