import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import counterReducer from "./CounterSlice"

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    counter: counterReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



