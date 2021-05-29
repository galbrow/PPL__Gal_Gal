// L2-eval-box.ts
// L2 with mutation (set!) and env-box model
// Direct evaluation of letrec with mutation, define supports mutual recursion.

import { is, map, reduce, repeat, zipWith } from "ramda";
import { isBoolExp, isCExp, isLitExp, isNumExp, isPrimOp, isStrExp, isVarRef,
         isAppExp, isDefineExp, isIfExp, isLetExp, isProcExp, Binding, VarDecl, CExp, Exp, IfExp, LetExp, ProcExp, Program,SetExp,
         parseL21Exp, DefineExp, makeLetExp, makeBinding, makeProcExp, makeNumExp, isSetExp, makeSetExp, makeVarRef} from "./L21-ast";
import { applyEnv, makeExtEnv, Env, Store, setStore, extendStore, ExtEnv, applyEnvStore, theGlobalEnv, globalEnvAddBinding, theStore, isGlobalEnv  } from "./L21-env-store";
import { isClosure, makeClosure, Closure, Value } from "./L21-value-store";
import { applyPrimitive } from "./evalPrimitive-store";
import { first, rest, isEmpty } from "../shared/list";
import { Result, bind, safe2, mapResult, makeFailure, makeOk, isOk, isFailure } from "../shared/result";
import { parse as p } from "../shared/parser";
import { makeBox, setBox, unbox } from "../shared/box";

// ========================================================
// Eval functions

const applicativeEval = (exp: CExp, env: Env): Result<Value> =>
    isNumExp(exp) ? makeOk(exp.val) :
    isBoolExp(exp) ? makeOk(exp.val) :
    isStrExp(exp) ? makeOk(exp.val) :
    isPrimOp(exp) ? makeOk(exp) :
    isVarRef(exp) ? applyEnvStore(exp.var,env):
    isLitExp(exp) ? makeOk(exp.val as Value) :
    isIfExp(exp) ? evalIf(exp, env) :
    isProcExp(exp) ? evalProc(exp, env) :
    isLetExp(exp) ? evalLet(exp,env):
    isSetExp(exp) ? evalSet(exp,env):
    isAppExp(exp) ? safe2((proc: Value, args: Value[]) => applyProcedure(proc, args))
                        (applicativeEval(exp.rator, env), mapResult((rand: CExp) => applicativeEval(rand, env), exp.rands)) :
    exp;

export const isTrueValue = (x: Value): boolean =>
    ! (x === false);

const evalIf = (exp: IfExp, env: Env): Result<Value> =>
    bind(applicativeEval(exp.test, env),
         (test: Value) => isTrueValue(test) ? applicativeEval(exp.then, env) : applicativeEval(exp.alt, env));

const evalProc = (exp: ProcExp, env: Env): Result<Closure> =>
    makeOk(makeClosure(exp.args, exp.body, env));

// LET: Direct evaluation rule without syntax expansion
// compute the values, extend the env, eval the body.
const evalLet = (exp: LetExp, env: Env): Result<Value> =>{
    const proc: ProcExp = makeProcExp(map(x=>x.var,exp.bindings),exp.body);
    const vals: CExp[] = map(x=>x.val,exp.bindings);
    return safe2((proc: Value, args: Value[]) => applyProcedure(proc, args))
    (applicativeEval(proc, env), mapResult((rand: CExp) => applicativeEval(rand, env), vals))
}

// KEY: This procedure does NOT have an env parameter.
//      Instead we use the env of the closure.
const applyProcedure = (proc: Value, args: Value[]): Result<Value> =>
    isPrimOp(proc) ? applyPrimitive(proc, args) :
    isClosure(proc) ? applyClosure(proc, args) :
    makeFailure(`Bad procedure ${JSON.stringify(proc)}`);

const fillArray = (index: number, arrSize: number, arr: number[]): number[]=>{
    return index===arrSize? arr :fillArray(index+1,arrSize,arr.concat([index]));
}

const applyClosure = (proc: Closure, args: Value[]): Result<Value> => {
    const vars = map((v: VarDecl) => v.var, proc.params);
    map(val=>extendStore(theStore,val),args);
    const len = theStore.vals.length; //check length -1
    const arr = fillArray(0,len,[]);
    const addresses: number[] = arr.slice(len-args.length);
    const newEnv: ExtEnv = makeExtEnv(vars, addresses, proc.env)
    return evalSequence(proc.body, newEnv);
}

// Evaluate a sequence of expressions (in a program)
export const evalSequence = (seq: Exp[], env: Env): Result<Value> =>
    isEmpty(seq) ? makeFailure("Empty program") :
    evalCExps(first(seq), rest(seq), env);
    
const evalCExps = (first: Exp, rest: Exp[], env: Env): Result<Value> =>
    isDefineExp(first) ? evalDefineExps(first, rest) :
    isCExp(first) && isEmpty(rest) ? applicativeEval(first, env) :
    isCExp(first) ? bind(applicativeEval(first, env), _ => evalSequence(rest, env)) :
    first;

const evalDefineExps = (def: DefineExp, exps: Exp[]): Result<Value> =>{
    const defineVal:Result<Value> = applicativeEval(def.val,theGlobalEnv);
    const res:Result<Store> = bind(defineVal,x=>makeOk(extendStore(theStore,x)));
    if(isFailure(res)) return res;
    const addr:number=theStore.vals.length-1;
    globalEnvAddBinding(def.var.var,addr);
    return evalSequence(exps,theGlobalEnv);
}

// Main program
// L2-BOX @@ Use GE instead of empty-env
export const evalProgram = (program: Program): Result<Value> =>
    evalSequence(program.exps, theGlobalEnv);

export const evalParse = (s: string): Result<Value> =>
    bind(bind(p(s), parseL21Exp), (exp: Exp) => evalSequence([exp], theGlobalEnv));

const evalSet = (exp: SetExp, env: Env): Result<void> =>{
    const index:number = isGlobalEnv(env)? unbox(env.vars).lastIndexOf(exp.var.var):env.vars.lastIndexOf(exp.var.var);
    if(index===-1){
        return isGlobalEnv(env)?makeFailure("the value does not exists in the env"):evalSet(exp,env.nextEnv);}
    const addr:number = isGlobalEnv(env)?unbox(env.addresses)[index]:env.addresses[index];
    return bind(evalSequence([exp.val],env),v=>makeOk(setBox(theStore.vals[addr],v)))
}
