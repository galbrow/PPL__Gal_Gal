"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stackManip = exports.pop = exports.push = void 0;
const state_1 = require("./state");
const push = (x) => (st) => {
    const oneElement = [x];
    const newSt = oneElement.concat(st); // => add the new element in the beggining of the stack
    return [newSt, undefined];
};
exports.push = push;
const pop = (st) => {
    return [st.slice(1, st.length), st[0]];
};
exports.pop = pop;
exports.stackManip = state_1.bind(exports.pop, x => exports.push((x * x) + x));
//# sourceMappingURL=stack.js.map