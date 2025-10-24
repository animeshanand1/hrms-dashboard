import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'hrms_settings_v1'

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { siteName: 'HRMS Dashboard', logoUrl: '', tagline: 'People first' }
    return JSON.parse(raw)
  } catch {
    return { siteName: 'HRMS Dashboard', logoUrl: '', tagline: 'People first' }
  }
}

const initialState = {
  ...loadSettings()
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings(state, action) {
      return { ...state, ...action.payload }
    },
    resetSettings(state) {
      return { siteName: 'HRMS Dashboard', logoUrl: '', tagline: 'People first' }
    }
  }
})

export const { setSettings, resetSettings } = settingsSlice.actions
export default settingsSlice.reducer
