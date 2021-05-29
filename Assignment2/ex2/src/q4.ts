import { map } from 'ramda';
import { Exp, isAppExp, isBoolExp, isDefineExp, isIfExp, isNumExp, isPrimOp, isProcExp, isVarDecl, isVarRef, Program } from '../imp/L3-ast';
import { Result, makeFailure, makeOk } from '../shared/result';
import { isProgram, unparseL31 } from './L31-ast';

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
// add or, and, , number? test

export const l2toPython = (exp: Exp | Program): string => 
    isNumExp(exp) || isBoolExp(exp) || isVarDecl(exp) || isVarRef(exp) ? unparseL31(exp):
    isPrimOp(exp)? unparseL31(exp)===('=' || 'eq?')? "==": unparseL31(exp) == "boolean?"? `(lambda x : (type(x) == bool))` : 
    unparseL31(exp) == "number?" ? `(lambda x : (type(x) == int || type(x) == float))` : unparseL31(exp) :
    isAppExp(exp) ? isPrimOp(exp.rator) ?unparseL31(exp.rator)===("not")? `(${unparseL31(exp.rator)} ${l2toPython(exp.rands[0])})` : `(${map(x=> l2toPython(x), exp.rands).join(` ${l2toPython(exp.rator)} `)})`:
                                            `${l2toPython(exp.rator)}(${map(x => l2toPython(x) , exp.rands).join(",")})`:
    isIfExp(exp) ? `(${l2toPython(exp.then)} if ${l2toPython(exp.test)} else ${l2toPython(exp.alt)})`:
    isProcExp(exp) ? `(lambda ${map(x => (x.var), exp.args).join(",")} : ${map(x => l2toPython(x), exp.body)})`:
    isDefineExp(exp) ? `${(exp.var.var)} = ${l2toPython(exp.val)}`:
    isProgram(exp) ? `${map(x => l2toPython(x), exp.exps).join("\n")}`:
    ""

export const l2ToPython = (exp: Exp | Program): Result<string> => 
    makeOk(l2toPython(exp));


    
