import { store }                from '@davstack/store'



type T_State = {
    srs_dir_path        : string,
    dest_dir_path       : string,
    ffmpeg_dir_path     : string,
    output_file_postfix : string,
    dep_time_correction : number,
    time_freefall       : number,
    time_start_offset   : number,
    time_end_offset     : number,
    min_accel_trigger   : number,
    no_ffmpeg_processing: boolean
}

type T_StateUPD = Partial<T_State>



const initialState: T_State = {
    srs_dir_path        : "",
    dest_dir_path       : "",
    ffmpeg_dir_path     : "",
    output_file_postfix : "",
    dep_time_correction : 0,
    time_freefall       : 0,
    time_start_offset   : 0,
    time_end_offset     : 0,
    min_accel_trigger   : 0,
    no_ffmpeg_processing: false,
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