import { ok } from "node:assert";
import { resourceLimits } from "node:worker_threads";
import { Result, makeFailure, makeOk, bind, either } from "../lib/result";

/* Library code */
const findOrThrow = <T>(pred: (x: T) => boolean, a: T[]): T => {
    for (let i = 0; i < a.length; i++) {
        if (pred(a[i])) return a[i];
    }
    throw "No element found.";
}

export const findResult : <T>(pred: (x: T) => boolean, a: T[]) => Result<T> =
    <T>(pred: (x: T) => boolean, a: T[]) =>{
    try{
        const ans: T = findOrThrow(pred, a);
        return {
            tag: "Ok",
            value: ans
        };
    } catch(e){
        return {
            tag: "Failure",
            message: e
        };
    }
}

/* Client code */
const returnSquaredIfFoundEven_v1 = (a: number[]): number => {
    try {
        const x = findOrThrow(x => x % 2 === 0, a);
        return x * x;
    } catch (e) {
        return -1;
    }
}

export const returnSquaredIfFoundEven_v2: (a: number[]) => Result<number> =
     (a: number[]) => {
         return bind(findResult(x => x % 2 === 0 ,a), y => {
             return {
                 tag: "Ok",
                 value: y*y
             }
         });
     }

export const returnSquaredIfFoundEven_v3: (a: number[]) => number = (a: number[]) =>{
    return either(findResult(x => x % 2 === 0 ,a), x=>x*x, x => -1);
};

