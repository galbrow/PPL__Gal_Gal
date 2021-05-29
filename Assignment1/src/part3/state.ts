
export type State<S, A> = (initialState: S) => [S, A];

export const bind = <S, A, B>(state: State<S, A>, f: (x: A) => State<S, B>) => 
    (initialState: S) => {
        const [newState,result] = state(initialState);
        const fState: State<S,B> = f(result);
        return fState(newState);
    }
