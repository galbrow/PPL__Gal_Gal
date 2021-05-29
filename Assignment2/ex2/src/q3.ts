import { ClassExp, ProcExp, Exp, Program, makeBoolExp,
     makeIfExp, makeStrExp, makeAppExp, makePrimOp, makeVarDecl, makeProcExp,
      Binding, IfExp, isBoolExp, isCExp, isIfExp, isClassExp, isAtomicExp, 
      isAppExp, isBinding, isNumExp, isProcExp, isPrimOp, isVarDecl, isVarRef, unparseL31, 
      parseL31Exp, makeLitExp, makeVarRef, CExp, parseSExp, isDefineExp, 
      makeDefineExp, isExp, isProgram, makeProgram, isLitExp, makeLetExp, isLetExp, makeBinding} from "./L31-ast";
import { Result, makeFailure, makeOk, bind, } from "../shared/result";
import { Sexp } from "s-expression";
import { map } from "ramda";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/

export const makeIfFromBindings = (bindings: Binding[]): IfExp => {
    const methodName = bindings[0].var.var;
    const bindBody = bindings[0].val;
    const body = parseL31Exp(unparseL31(bindBody));
    return makeIfExp(makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeLitExp('\''+methodName)]), 
    makeAppExp(bindBody, []), (bindings.length === 1)? makeBoolExp(false): makeIfFromBindings(bindings.slice(1)));
}

export const class2proc = (exp: ClassExp): ProcExp => {
    const vars = exp.vars;
    const bindings = exp.bindings
    const msg = [makeVarDecl("msg")];   
    return (bindings.length === 0)? makeProcExp(msg, [makeBoolExp(false)]) :
    makeProcExp(vars,[makeProcExp(msg,  [makeIfFromBindings(bindings)])]);
}

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/

export const L31ToL3Help = (exp: Exp | Program): Exp | Program =>
    isExp(exp)? reWriteAllClassExp(exp):
    isProgram(exp)? makeProgram(map(reWriteAllClassExp, exp.exps)): exp;

export const reWriteAllClassExp = (exp: Exp) : Exp =>
    isCExp(exp)? reWriteAllCExp(exp):
    isDefineExp(exp)? makeDefineExp(exp.var, reWriteAllCExp(exp.val)):
    exp;

export const reWriteAllCExp = (exp: CExp): CExp =>
    isAtomicExp(exp) ? exp :
    isLitExp(exp) ? exp :
    isIfExp(exp) ? makeIfExp(reWriteAllCExp(exp.test),reWriteAllCExp(exp.then),
    reWriteAllCExp(exp.alt)) :
    isAppExp(exp) ? makeAppExp(reWriteAllCExp(exp.rator),map(reWriteAllCExp, exp.rands)) :
    isProcExp(exp) ? makeProcExp(exp.args, map(reWriteAllCExp, exp.body)) :
    isLetExp(exp) ? makeLetExp(map((m)=> makeBinding(m.var.var, reWriteAllCExp(m.val)), exp.bindings), map(reWriteAllCExp, exp.body)):
    isClassExp(exp) ? reWriteAllCExp(class2proc(exp)):
    exp;

export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    makeOk(L31ToL3Help(exp));
    

