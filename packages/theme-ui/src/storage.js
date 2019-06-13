const STORAGE_KEY = 'theme-ui-color-mode'

export const storage = {
  get: (init) => window.localStorage.getItem(STORAGE_KEY) || init,
  set: (value) => window.localStorage.setItem(STORAGE_KEY, value),
}

export default storage
