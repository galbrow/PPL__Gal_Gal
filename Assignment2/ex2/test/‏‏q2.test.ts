import fs from "fs";
import { expect } from 'chai';
import {  evalL3program } from '../imp/L3-eval';
import { Value } from "../imp/L3-value";
import { Result, bind, makeOk } from "../shared/result";
import { parseL3 } from "../imp/L3-ast";
import { listPrim} from "../imp/evalPrimitive";


const evalP = (x: string): Result<Value> =>
    bind(parseL3(x), evalL3program);

const q2: string = fs.readFileSync(__dirname + '/../src/q2.l3', { encoding: 'utf-8' });
describe('Q2 Tests', () => {    
    it('append tests', () => {
        expect(evalP(`(L3 ` + q2 + ` (append (list 1) (list 2 3)))`)).to.deep.equal(makeOk(listPrim([1,2,3])));
        expect(evalP(`(L3 ` + q2 + ` (append (list ) (list 1 2 3)))`)).to.deep.equal(makeOk(listPrim([1,2,3])));
    });
    it(`reverse tests`,()=>
    {
        expect(evalP(`(L3 ` + q2 + ` (reverse  (list 1 2 3)))`)).to.deep.equal(makeOk(listPrim([3,2,1])));
        expect(evalP(`(L3 ` + q2 + ` (reverse  '()))`)).to.deep.equal(makeOk(listPrim([])));

    });
    it(`duplicate-items tests`,()=>
    {
        expect(evalP(`(L3`+q2+`(duplicate-items (list 1 2 3) (list 1 0 5) ))`)).to.deep.equal(makeOk(listPrim([1,3,3,3,3,3])));
        expect(evalP(`(L3`+q2+`(duplicate-items (list 1 2 3 4) (list 1 2) ))`)).to.deep.equal(makeOk(listPrim([1,2,2,3,4,4])));
        expect(evalP(`(L3`+q2+`(duplicate-items (list 1 2 3 4) (list 1) ))`)).to.deep.equal(makeOk(listPrim([1,2,3,4])));

    }
    );
    it(`duplicateItems tests`,()=>
    {
        expect(evalP(`(L3`+q2+`(duplicateItems (list 1 2 3) (list 1 0 1 0) (list ) ))`)).to.deep.equal(makeOk(listPrim([1,3])));
        expect(evalP(`(L3`+q2+`(duplicateItems (list 1 2 3 4) (list 1 1 1 1) (list ) ))`)).to.deep.equal(makeOk(listPrim([1,2,3,4])));
    }
    );
    
    it(`listLength tests`,()=>
    {
        expect(evalP(`(L3`+q2+`(listLength (list ) 0 ))`)).to.deep.equal(makeOk(0));
        expect(evalP(`(L3`+q2+`(listLength (list 1 2 3) 0 ))`)).to.deep.equal(makeOk(3));
    }
    );
    it(`dupItem tests`,()=>
    {
        expect(evalP(`(L3`+q2+`(dupItem 7 3 (list ) ))`)).to.deep.equal(makeOk(listPrim([7,7,7])));
        expect(evalP(`(L3`+q2+`(dupItem 6 0 (list ) ))`)).to.deep.equal(makeOk(listPrim([])));
    }
    );
    it(`fixedList`,()=>
    {
        expect(evalP(`(L3`+q2+`(fixedList 5 (list )))`)).to.deep.equal(makeOk(listPrim([])));
    });

    it(`payment`,()=>
    {
        expect(evalP(`(L3`+q2+`(payment 10 (list 5 5 10)))`)).to.deep.equal(makeOk(2));
        expect(evalP(`(L3`+q2+`(payment 5 (list 1 1 1 2 2 5 10)))`)).to.deep.equal(makeOk(3));
        expect(evalP(`(L3`+q2+`(payment 0 (list 1 2 5)))`)).to.deep.equal(makeOk(1));
        expect(evalP(`(L3`+q2+`(payment 5 '()))`)).to.deep.equal(makeOk(0));

    }
    );
    it(`"compose-n`,()=>
    {
        expect(evalP(`(L3`+q2+`((compose-n (lambda(x) (+ 2 x))2) 3))`)).to.deep.equal(makeOk(7));
        expect(evalP(`(L3`+q2+`((compose-n (lambda(x) (* 2 x))2) 3))`)).to.deep.equal(makeOk(12));
    });
});

