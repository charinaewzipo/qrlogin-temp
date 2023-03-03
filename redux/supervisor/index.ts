import { createSlice } from '@reduxjs/toolkit'
import { dispatch } from '..'
import { fetchGetSupervisor } from '@unfinity/services/supervisor'

const initialState: ISupervisorStoreState = {
    isLoading: false,
    error: null,
    supervisor: {
        name: '',
        email: '',
        code: '',
        pic: '',
    }
}

const slice = createSlice({
    name: 'supervisor',
    initialState,
    reducers: {
        startLoadingAction(state) {
            state.isLoading = true
        },
        hasErrorAction(state, action) {
            state.isLoading = false
            state.error = action.payload
        },
        getSupervisorAction(state, action) {
            state.isLoading = false
            state.supervisor = action.payload
        }
    }
})

export default slice.reducer
export const { startLoadingAction, hasErrorAction, getSupervisorAction } = slice.actions
export const getSupervisor = (code: string) => async () => {
    dispatch(slice.actions.startLoadingAction())
    try {
        if (code === '999999') {
            throw '500'
        }
        const response = await fetchGetSupervisor(code)
        dispatch(slice.actions.getSupervisorAction(response))
    } catch (error) {
        console.log('error: ', error)
        dispatch(slice.actions.hasErrorAction(error))
    }
}