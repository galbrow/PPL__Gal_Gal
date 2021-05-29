import * as R from "ramda";
const stringToArray = R.split("");

/* Question 1 */
export const countVowels : (s: string) => number = (s: string) => {
    return R.filter((x: string) => x === "a" || x=== "u" || x==="i" || x==="o" || x==="e" || 
    x==="A" || x=== "U" || x==="I" || x==="O" || x==="E", stringToArray(s)).length;
};

//helper function to Q2
export const runLengthEncodingRec = (arr: string[], index: number, counter: number, compressed: string): string =>{
    if(index === arr.length-1) {
        if(counter === 1) return compressed;
        else return compressed + counter;
    }  

    if(arr[index] === arr[index+1])//if curr letter is equal to prevLetter
        return runLengthEncodingRec(arr, index+1, counter+1, compressed);
    else{ //if curr letter != previous letter
        if(counter === 1)
            return runLengthEncodingRec(arr, index+1, 1, compressed + arr[index+1]);
        else
            return runLengthEncodingRec(arr, index+1, 1, compressed+counter+arr[index+1]);     
    }
}

/* Question 2 */
export const runLengthEncoding = (s: string) :string => {
    if(s === "") return "";
    const arr: string[] = stringToArray(s);
    return runLengthEncodingRec(arr, 0, 1, arr[0]);
};



/* Question 3 */
export const filterPar = (arr: string[]): string[] =>{
    return R.filter((x: string) => x===")" || x==="(" ||x==="}" || x==="{" || x==="]" || x==="[", arr)
}

export const isPairedRec = (arr: string[], st:string, index: number): boolean =>{
    if(index === arr.length && st.length ===0) return true;
    if(index === arr.length) return false;
    const c: string = arr[index];
    if(c === "(" || c=== "{" || c=== "["){
        return isPairedRec(arr, st+c, index+1);
    } else{ 
        const last: string = st.charAt(st.length-1);
        switch(c){
            case ")": return (last === "(")? isPairedRec(arr, st.substring(0,st.length-1), index+1): false;
            case "]": return (last === "[")? isPairedRec(arr, st.substring(0,st.length-1), index+1): false;
            case "}": return (last === "{")? isPairedRec(arr, st.substring(0,st.length-1), index+1): false;
        }
    }
    return true;
}

export const isPaired: (s: string) => boolean = (s: string) => {
    const arr: string[] = filterPar(stringToArray(s));
    return isPairedRec(arr, "", 0);
};