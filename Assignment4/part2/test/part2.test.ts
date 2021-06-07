// noinspection DuplicatedCode

import chai, { expect } from 'chai';

// import { , asyncWaterfallWithRetry, getAll, lazyFilter, lazyMap, makePromisedStore, MISSING_KEY } from '../src/part2';
import {asyncWaterfallWithRetry,makePromisedStore, MISSING_KEY, getAll, asycMemo, lazyFilter, lazyMap} from '../src/part2'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

describe('2.1 (PromisedStore)', () => {
    it('stores and retrieves value', async () => {
        const store = makePromisedStore()
        await store.set('a', 42)
        const a = await store.get('a')
        expect(a).to.equal(42)
    })

    it('throws on missing key', async () => {
        const store = makePromisedStore()
        await expect(store.get('a')).to.be.rejectedWith(MISSING_KEY)
    })

    it('delete value from store', async ()=>{
        const store = makePromisedStore()
        await store.set("Gal", 26)
        const gal = await store.get("Gal")
        expect(gal).to.equal(26)
        store.delete("Gal")
        await expect (store.get("Gal")).to.be.rejected
    })

    it('getAll retrieves an array', async () => {
        const store = makePromisedStore()
        await store.set('a', 42)
        await store.set('b', 24)
        expect(await getAll(store,['a', 'b'])).to.deep.equal([42, 24])
        expect(await getAll(store,['b', 'a'])).to.deep.equal([24, 42])
    })
})

describe('2.2 (asycMemo)', () => {
    it('memoizes calls', async () => {
        let ret = 'cached'
        const memo = asycMemo((x) => ret)

        expect(await memo('a')).to.equal('cached')
        ret = 'new'
        expect(await memo('a')).to.equal('cached')
        expect(await memo('b')).to.equal('new')
    })
})

describe('2.3 (lazy generators)', () => {
    function * countTo4(): Generator<number> {
        for (let i = 1; i <= 4; i++) {
            yield i
        }
    }

    it('filters', async () => {
        const gen = lazyFilter(countTo4, (v) => v % 2 == 0)()    
        expect([...gen]).to.deep.equal([2, 4])
    })

    it('maps', async () => {
        const gen = lazyMap(countTo4, (v) => v ** 2)()

        expect([...gen]).to.deep.equal([1, 4, 9, 16])
    })
})

describe('2.4 (asyncWaterfallWithRetry)', () => {
    it('executes sequence', async () => {
        const v = await asyncWaterfallWithRetry([async () => 1, async v => v + 1, async v => v * 2 ])
        expect(v).to.equal(4)
    })

    it('retries twice', async () => {
        let attempt = 1
        let flag = 1;
        const v = await asyncWaterfallWithRetry([async () =>{
            //if(flag == 2){
                return 1
            //}
               //else{
        //flag +=1
        //.throw Error()}}
        }
        , async v => {
            if (attempt == 3)
                return v + 1
            attempt += 1
            throw Error()
        }, async v => v * 2 ])
        //console.log(v)
        expect(v).to.equal(4)
    }).timeout(5000)
})