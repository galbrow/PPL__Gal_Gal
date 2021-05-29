"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnSquaredIfFoundEven_v3 = exports.returnSquaredIfFoundEven_v2 = exports.findResult = void 0;
const result_1 = require("../lib/result");
/* Library code */
const findOrThrow = (pred, a) => {
    for (let i = 0; i < a.length; i++) {
        if (pred(a[i]))
            return a[i];
    }
    throw "No element found.";
};
const findResult = (pred, a) => {
    try {
        const ans = findOrThrow(pred, a);
        return {
            tag: "Ok",
            value: ans
        };
    }
    catch (e) {
        return {
            tag: "Failure",
            message: e
        };
    }
};
exports.findResult = findResult;
/* Client code */
const returnSquaredIfFoundEven_v1 = (a) => {
    try {
        const x = findOrThrow(x => x % 2 === 0, a);
        return x * x;
    }
    catch (e) {
        return -1;
    }
};
const returnSquaredIfFoundEven_v2 = (a) => {
    return result_1.bind(exports.findResult(x => x % 2 === 0, a), y => {
        return {
            tag: "Ok",
            value: y * y
        };
    });
};
exports.returnSquaredIfFoundEven_v2 = returnSquaredIfFoundEven_v2;
const returnSquaredIfFoundEven_v3 = (a) => {
    return result_1.either(exports.findResult(x => x % 2 === 0, a), x => x * x, x => -1);
};
exports.returnSquaredIfFoundEven_v3 = returnSquaredIfFoundEven_v3;
//# sourceMappingURL=find.js.map