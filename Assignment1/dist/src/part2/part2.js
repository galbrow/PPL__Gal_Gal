"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPaired = exports.isPairedRec = exports.filterPar = exports.isPairedByValue = exports.runLengthEncoding = exports.runLengthEncodingRec = exports.countVowels = void 0;
const R = require("ramda");
const stringToArray = R.split("");
/* Question 1 */
const countVowels = (s) => {
    return R.filter((x) => x === "a" || x === "u" || x === "i" || x === "o" || x === "e" ||
        x === "A" || x === "U" || x === "I" || x === "O" || x === "E", stringToArray(s)).length;
};
exports.countVowels = countVowels;
//helper function to Q2
const runLengthEncodingRec = (arr, index, counter, compressed) => {
    if (index === arr.length - 1) {
        if (counter === 1)
            return compressed;
        else
            return compressed + counter;
    }
    if (arr[index] === arr[index + 1]) //if curr letter is equal to prevLetter
        return exports.runLengthEncodingRec(arr, index + 1, counter + 1, compressed);
    else { //if curr letter != previous letter
        if (counter === 1)
            return exports.runLengthEncodingRec(arr, index + 1, 1, compressed + arr[index + 1]);
        else
            return exports.runLengthEncodingRec(arr, index + 1, 1, compressed + counter + arr[index + 1]);
    }
};
exports.runLengthEncodingRec = runLengthEncodingRec;
/* Question 2 */
const runLengthEncoding = (s) => {
    if (s === "")
        return "";
    const arr = stringToArray(s);
    return exports.runLengthEncodingRec(arr, 0, 1, arr[0]);
};
exports.runLengthEncoding = runLengthEncoding;
/* Question 3 */
const countParentheses = (a, b) => {
    return (a < 0) ? -1 : a + b;
};
const isPairedByValue = (arr, a, b) => {
    const filteredArr = R.filter((x) => x === a || x === b, arr);
    const finalArr = R.map((x) => x === b ? -1 : 1, filteredArr);
    const n = R.reduce((acc, curr) => countParentheses(acc, curr), 0, finalArr);
    return (n === 0) ? true : false;
};
exports.isPairedByValue = isPairedByValue;
const filterPar = (arr) => {
    return R.filter((x) => x === ")" || x === "(" || x === "}" || x === "{" || x === "]" || x === "[", arr);
};
exports.filterPar = filterPar;
const isPairedRec = (arr, st, index) => {
    if (index === arr.length)
        return true;
    const c = arr[index];
    if (c === "(" || c === "{" || c === "[") {
        return exports.isPairedRec(arr, st + c, index + 1);
    }
    else {
        const last = st.charAt(st.length - 1);
        switch (c) {
            case ")": return (last === "(") ? exports.isPairedRec(arr, st.substring(0, st.length - 1), index + 1) : false;
            case "]": return (last === "[") ? exports.isPairedRec(arr, st.substring(0, st.length - 1), index + 1) : false;
            case "}": return (last === "{") ? exports.isPairedRec(arr, st.substring(0, st.length - 1), index + 1) : false;
        }
    }
    return true;
};
exports.isPairedRec = isPairedRec;
const isPaired = (s) => {
    const arr = stringToArray(s);
    return exports.isPairedRec(arr, "", 0);
    // return (isPairedByValue(arr, "(", ")") && isPairedByValue(arr, "[", "]") && isPairedByValue(arr, "{", "}"));
};
exports.isPaired = isPaired;
console.log(exports.isPaired("hi())"));
//)
//({)}
//({})()
//
//# sourceMappingURL=part2.js.map