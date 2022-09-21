import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import goalsService from './goalService'

const initialState = {
    goals: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Create new goal

export const createGoal = createAsyncThunk('goals/create', async (goalData, thunkAPI) => {
    try {
        // We are using a private method here, so we need to attach the current logged in users token
        const token = thunkAPI.getState().auth.user.token
        return await goalsService.createGoal(goalData, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString
        return thunkAPI.rejectWithValue(message)
    }
})
 
// Get user goals
export const getGoals = createAsyncThunk('goals/getAll', async (_, thunkAPI) =>
{
    try {
        // We are using a private method here, so we need to attach the current logged in users token
        const token = thunkAPI.getState().auth.user.token
        return await goalsService.getGoals(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString
        return thunkAPI.rejectWithValue(message)
    }
})

// Delete user goal
export const deleteGoal = createAsyncThunk('goals/delete', async (id, thunkAPI) =>
{
    try {
        // We are using a private method here, so we need to attach the current logged in users token
        const token = thunkAPI.getState().auth.user.token
        return await goalsService.deleteGoal(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString
        return thunkAPI.rejectWithValue(message)
    }
})


export const goalSlice = createSlice({
    name: 'goal',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        // createGoal Reducers
        .addCase(createGoal.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createGoal.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.goals.push(action.payload)
        })
        .addCase(createGoal.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        // getGoal Reducers
        .addCase(getGoals.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getGoals.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.goals = action.payload
        })
        .addCase(getGoals.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        // deleteGoal Reducers
        .addCase(deleteGoal.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteGoal.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // Filter out goal from out state.goals
            state.goals = state.goals.filter((goal) => goal._id !== action.meta.arg)
        })
        .addCase(deleteGoal.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const { reset } = goalSlice.actions
export default goalSlice.reducer