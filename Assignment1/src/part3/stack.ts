import { State, bind } from "./state";

export type Stack = number[];

export const push = (x: number): State<Stack, undefined> => 
    (st: Stack) : [Stack, undefined] => {
        const oneElement: number[] = [x];
        const newSt: Stack = oneElement.concat(st); // => add the new element in the beggining of the stack
        return [newSt, undefined];
    }

export const pop: State <Stack, number> = (st: Stack) => {
    return [st.slice(1, st.length), st[0]];
};

export const stackManip : State<Stack, undefined> = 
    bind(pop, x => bind(bind(push(x*x),()=>pop),y=>push(y+x)));

