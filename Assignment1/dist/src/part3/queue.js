"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueManip = exports.dequeue = exports.enqueue = void 0;
const state_1 = require("./state");
const enqueue = (x) => (q) => {
    const oneElement = [x];
    const newQ = q.concat(oneElement);
    return [newQ, undefined];
};
exports.enqueue = enqueue;
const dequeue = (q) => {
    return [q.slice(1, q.length), q[0]];
};
exports.dequeue = dequeue;
exports.queueManip = state_1.bind(exports.dequeue, firstElement => state_1.bind(state_1.bind(exports.enqueue(firstElement * 2), () => exports.enqueue(firstElement / 3)), () => exports.dequeue));
//# sourceMappingURL=queue.js.map