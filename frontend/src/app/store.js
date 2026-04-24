import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api.js';
import uiReducer from './uiSlice.js';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,  // RTK Query cache lives here
    ui: uiReducer,                   // selected alert, active panel
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),  // enables polling + cache lifecycle
});