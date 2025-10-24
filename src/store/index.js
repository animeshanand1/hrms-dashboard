import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import settingsReducer from './settingsSlice'

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
    , settings: settingsReducer
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
    // persist settings to localStorage
    try {
      const settings = state.settings;
      if (settings) localStorage.setItem('hrms_settings_v1', JSON.stringify(settings));
    } catch {}
  } catch {
    // ignore
  }
});
