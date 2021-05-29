"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = void 0;
const bind = (state, f) => (initialState) => {
    const [newState, result] = state(initialState);
    const fState = f(result);
    return fState(newState);
};
exports.bind = bind;
//# sourceMappingURL=state.js.map