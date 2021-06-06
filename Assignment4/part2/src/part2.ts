/* 2.1 */

export const MISSING_KEY = '___MISSING___'

type PromisedStore<K, V> = {
    get(key: K): Promise<V>,
    set(key: K, value: V): Promise<void>,
    delete(key: K): Promise<void>
}


export function makePromisedStore<K, V>(): PromisedStore<K, V> {
    const promiseStore = new Map(); //check if const is ok
    return {
        get(key: K) {
            return promiseStore.has(key)? Promise.resolve(promiseStore.get(key)) : Promise.reject(MISSING_KEY)
        },
        set(key: K, value: V) {
            promiseStore.set(key, value)
            return Promise.resolve();
        },
        delete(key: K) {
            if(promiseStore.has(key)){
                promiseStore.delete(key)
                return Promise.resolve();
            }else
                return Promise.reject(MISSING_KEY)
        },
    }
}

export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> {
    const toReturn: Promise<V>[] = keys.map( k => {
        return store.get(k)
    }) 

   return Promise.all(toReturn)
}

/* 2.2 */

export function helper<T, R>(f: (param: T) => R, store: PromisedStore<T, R>): (param: T) => Promise<R> {
    return async (param: T) => {
        return await store.get(param)
        .then((val)=> val)
        .catch(() => store.set(param, f(param)).then(()=> f(param)))
    }
}

export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
    const store: PromisedStore<T, R> = makePromisedStore()
    return helper(f, store)
}
   


/* 2.3 */
/*
function * countTo4(): Generator<number> {
        for (let i = 1; i <= 4; i++) {
            yield i
        }
    }
*/

export function lazyFilter<T>(genFn: () => Generator<T>, filterFn: (x:T) => Boolean): () => Generator<T> {
     function * gen(): Generator<T> {
        for(let x of genFn()) {
            if(filterFn(x))
                yield x;
        }
    }
    return gen
}

export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (x:T) => R): () => Generator<R> {
    function * gen(): Generator<R> {
        for(let x of genFn()) {
                yield mapFn(x);
        }
    }
    return gen
}

/* 2.4 */
// you can use 'any' in this question

const makeTimeOutPromise = async (func:(x:any) => Promise<any> ,value:any) : Promise<any> =>
    await new Promise<any>((r) => setTimeout(() => r(func(value)) ,2000))

export function asyncWaterfallWithRetry(fns: [() => Promise<any>, ...((x:any) => Promise<any>)[]]): Promise<any> {
    return fns.slice(1).reduce(
        (acc : Promise<any>,func : (x:any) => Promise<any>) =>
        acc.then((x: any) => func(x)
        .catch(() => makeTimeOutPromise(func,x))
        .catch(() => makeTimeOutPromise(func,x)))
        ,fns[0]())
}