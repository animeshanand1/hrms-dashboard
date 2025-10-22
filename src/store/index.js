import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

// Try to rehydrate auth from localStorage to keep demo login across reloads
const preloadedAuth = (() => {
  try {
    const raw = localStorage.getItem('reduxAuth');
    if (!raw) return undefined;
    return { auth: { user: JSON.parse(raw) } };
  } catch {
    return undefined;
  }
})();

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  preloadedState: preloadedAuth
})

// Persist auth.user to localStorage
store.subscribe(() => {
  try {
    const state = store.getState();
    const user = state.auth.user;
    if (user) localStorage.setItem('reduxAuth', JSON.stringify(user));
    else localStorage.removeItem('reduxAuth');
  } catch {
    // ignore
  }
});
