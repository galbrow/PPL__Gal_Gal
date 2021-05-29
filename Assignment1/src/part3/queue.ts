import { State, bind } from "./state";

export type Queue = number[];

export const enqueue = (x: number) : State<Queue, undefined> =>
    (q: Queue) : [Queue, undefined]=>{
        const oneElement: number[] = [x];
        const newQ: Queue = q.concat(oneElement);
        return [newQ, undefined];
    }

export const dequeue: State <Queue, number> = (q: Queue) => {
    return [q.slice(1,q.length),q[0]];
}

export const queueManip: State<Queue,number> =
    bind(dequeue, firstElement =>bind(bind(enqueue(firstElement*2),()=>enqueue(firstElement/3)),()=>dequeue));
   
