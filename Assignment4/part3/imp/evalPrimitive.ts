import { PrimOp } from "../src/L51-ast";
import { Value, isSymbolSExp, isCompoundSExp, makeCompoundSExp, makeEmptySExp, isEmptySExp, CompoundSExp, EmptySExp } from "./L5-value";
import { Result, makeFailure, makeOk } from "../shared/result";
import { allT, first, rest } from "../shared/list";
import { isNumber, isString, isBoolean } from "../shared/type-predicates";
import { reduce } from "ramda";


export const applyPrimitive = (proc: PrimOp, args: Value[]): Result<Value> =>
    proc.op === "+" ? (allT(isNumber, args) ? makeOk(reduce((x: number, y: number) => x + y, 0, args)) : makeFailure(`+ expects numbers only. Got ${JSON.stringify(args, null, 2)}`)) :
    proc.op === "-" ? minusPrim(args) :
    proc.op === "*" ? (allT(isNumber, args) ? makeOk(reduce((x: number, y: number) => x * y, 1, args)) : makeFailure(" expects numbers only")) :
    proc.op === "/" ? divPrim(args) :
    proc.op === ">" ? ((allT(isNumber, args) || allT(isString, args)) ? makeOk(args[0] > args[1]) : makeFailure("> expects numbers or strings only")) :
    proc.op === "<" ? ((allT(isNumber, args) || allT(isString, args)) ? makeOk(args[0] < args[1]) : makeFailure("< expects numbers or strings only")) :
    proc.op === "=" ? makeOk(args[0] === args[1]) :
    proc.op === "not" ? makeOk(! args[0]) :
    proc.op === "and" ? isBoolean(args[0]) && isBoolean(args[1]) ? makeOk(args[0] && args[1]) : makeFailure('Arguments to "and" not booleans') :
    proc.op === "or" ? isBoolean(args[0]) && isBoolean(args[1]) ? makeOk(args[0] || args[1]) : makeFailure('Arguments to "or" not booleans') :
    proc.op === "eq?" ? makeOk(eqPrim(args)) :
    proc.op === "string=?" ? makeOk(args[0] === args[1]) :
    proc.op === "cons" ? makeOk(consPrim(args[0], args[1])) :
    proc.op === "car" ? carPrim(args[0]) :
    proc.op === "cdr" ? cdrPrim(args[0]) :
    proc.op === "list" ? makeOk(listPrim(args)) :
    proc.op === "list?" ? makeOk(isListPrim(args[0])) :
    proc.op === "pair?" ? makeOk(isPairPrim(args[0])) :
    proc.op === "number?" ? makeOk(typeof(args[0]) === 'number') :
    proc.op === "boolean?" ? makeOk(typeof(args[0]) === 'boolean') :
    proc.op === "symbol?" ? makeOk(isSymbolSExp(args[0])) :
    proc.op === "string?" ? makeOk(isString(args[0])) :
    makeFailure("Bad primitive op " + proc.op);

const minusPrim = (args: Value[]): Result<number> => {
        if(args.length===0)
            return makeFailure("- expected at least 1 argument");
        if(args.length===1){return isNumber(args[0]) ? makeOk((-1)*args[0]) : makeFailure("expected numbers only")}
        return (allT(isNumber, args) ? makeOk(reduce((x: number, y: number) => x - y, args[0] * 2, args)) : makeFailure(`- expects numbers only. Got ${JSON.stringify(args, null, 2)}`))
}

const isNotZero = (args: Value[]): Boolean => {
    return allT(isNumber, args)? reduce((x: boolean, y: number) => y!=0 && x ,true,args) : false;
}

const divPrim = (args: Value[]): Result<number> => {
    if(args.length===0)
        return makeFailure("/ expected at least 1 argument");
    else if(args.length===1){return args[0]===0 || !isNumber(args[0]) ? makeFailure("cannot div with 0") : makeOk(1/args[0])}
    return (allT(isNumber,args) && isNotZero(args) ? makeOk(reduce((x: number, y: number) => x / y, args[0] * args[0], args)) :
            makeFailure(`/ expects numbers only. Got ${JSON.stringify(args, null, 2)}`));}

const eqPrim = (args: Value[]): boolean => {
    const x = args[0], y = args[1];
    if (isSymbolSExp(x) && isSymbolSExp(y)) {
        return x.val === y.val;
    } else if (isEmptySExp(x) && isEmptySExp(y)) {
        return true;
    } else if (isNumber(x) && isNumber(y)) {
        return x === y;
    } else if (isString(x) && isString(y)) {
        return x === y;
    } else if (isBoolean(x) && isBoolean(y)) {
        return x === y;
    } else {
        return false;
    }
}

const carPrim = (v: Value): Result<Value> =>
    isCompoundSExp(v) ? makeOk(v.val1) :
    makeFailure(`Car: param is not compound ${v}`);

const cdrPrim = (v: Value): Result<Value> =>
    isCompoundSExp(v) ? makeOk(v.val2) :
    makeFailure(`Cdr: param is not compound ${v}`);

const consPrim = (v1: Value, v2: Value): CompoundSExp =>
    makeCompoundSExp(v1, v2);

export const listPrim = (vals: Value[]): EmptySExp | CompoundSExp =>
    vals.length === 0 ? makeEmptySExp() :
    makeCompoundSExp(first(vals), listPrim(rest(vals)))

const isListPrim = (v: Value): boolean =>
    isEmptySExp(v) || isCompoundSExp(v);

const isPairPrim = (v: Value): boolean =>
    isCompoundSExp(v);

