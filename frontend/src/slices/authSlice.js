import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setCredetials: (state, action) => {
            console.log('Payload in setCredetials:', action.payload); // Лог для перевірки
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const {setCredetials, logout} = authSlice.actions;

export default authSlice.reducer;
