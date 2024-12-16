import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice"
import { apiSlice } from "./slices/apiSlice";
import taskReducer from "./slices/taskSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    task: taskReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
