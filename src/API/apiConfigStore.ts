import { store }                from '@davstack/store'



type T_State = {
    curDir   : string;
    curName  : string;
    isName   : boolean;
    curFlight: number;
    isFight  : boolean;
}

type T_StateUPD = Partial<T_State>



const initialState: T_State = {
    curDir   : ".",
    curName  : "...",
    curFlight: 1,
    isName   : false,
    isFight  : false,
}


const storeOptions = {
    devtools: {enabled:true},
	persist: {
        enabled: true,
        name: 'config-storage',
    },
    name: 'configStore',
}



const storeInstance = store(initialState, storeOptions)
    .state(initialState)
	.actions((store) => ({
        updState: (payload:T_StateUPD) => {store.set(
            draft => {return {...draft, ...payload}}
        )},
    })).
    effects((store) => ({
        logChanges: () => store.onChange(console.log),
    }))

export {
    storeInstance as configStore
}

export type {
    T_State    as T_apiConfigState,
    T_StateUPD as T_apiConfigStateUPD,
}