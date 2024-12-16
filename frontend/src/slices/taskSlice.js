import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedTask: null, // Це зберігає вибраний курс
};

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
        },
        clearSelectedTask: (state) => {
            state.selectedTask = null;
        },
    },
});

export const { setSelectedTask, clearSelectedTaske } = taskSlice.actions;
export default taskSlice.reducer;