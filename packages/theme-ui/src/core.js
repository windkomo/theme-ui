// refactored stateful theme provider
import jsx from './jsx'
import {
  useContext,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
} from 'react'
import styled from '@emotion/styled'
import { ThemeContext as Emotion, Global } from '@emotion/core'
import { MDXProvider } from '@mdx-js/react'
import { css, get } from '@styled-system/css'
import merge from 'lodash.merge'
import themed from './themed'
import { Context } from './context'

const IS_DEV = process.env.NODE_ENV !== 'production'

const reducer = (state, next) => merge({}, state, next)

const Provider = ({ context, children }) => {
  const [ state, setTheme ] = useReducer(reducer, context.theme)
  const theme = applyColorMode(state, context.colorMode)
  theme.setTheme = setTheme

  useEffect(() => {
    // todo: support multiple instances
    window.THEME_UI = window.THEME_UI || theme
  }, [])

  return jsx(Emotion.Provider, { value: theme },
    jsx(MDXProvider, { components: context.components },
      jsx(Context.Provider, { value: context },
        children
      )
    )
  )
}

const createComponents = (components = {}) => {
  const next = {}
  Object.keys(components).forEach(key => {
    next[key] = styled(components[key])(themed(key))
  })
  return next
}

const applyColorMode = (theme = {}, colorMode) => ({
  ...theme,
  colors: merge({},
    theme.colors,
    get(theme, `colors.modes.${colorMode}`, {})
  )
})

const STORAGE_KEY = 'theme-ui-color-mode'

const storage = {
  get: (init) => window.localStorage.getItem(STORAGE_KEY) || init,
  set: (value) => window.localStorage.setItem(STORAGE_KEY, value),
}

const getMediaQuery = () => {
  const darkQuery = '(prefers-color-scheme: dark)'
  const mql = window.matchMedia ? window.matchMedia(darkQuery) : {}
  const dark = mql.media === darkQuery
  return dark && mql.matches
}

const useStoredColorMode = ({ colorMode, setColorMode }) => {
  useLayoutEffect(() => {
    const stored = storage.get()
    document.body.classList.remove('theme-ui-' + stored)
    if (!stored) {
      const dark = getMediaQuery()
      if (dark) setColorMode('dark')
      return
    }
    setColorMode(stored)
  }, [])
}

const useThemeContext = ({ theme, components }) => {
  const outer = useContext(Context)
  const isNested = !!outer.colorMode

  const [ colorMode, setColorMode ] = useState(theme.initialColorMode)

  const context = merge({
    colorMode,
    setColorMode,
  }, outer, {
    theme,
    components: createComponents(components)
  })

  useStoredColorMode(context)

  return context
}

export const ThemeProvider = ({
  theme = {},
  components,
  children,
}) => {
  const context = useThemeContext({ theme, components })

  return jsx(Provider, { context, children })
}

export const useColorMode = (initialMode) => {
  const { colorMode, setColorMode } = useContext(Context)

  if (typeof setColorMode !== 'function') {
    throw new Error(
      `[useColorMode] requires the ThemeProvider component`
    )
  }

  return [ colorMode, setColorMode ]
}

const bodyColor = (theme = {}) => {
  if (!theme.colors || !theme.colors.modes) return
  const { modes } = theme.colors
  const styles = {}
  Object.keys(modes).forEach(mode => {
    const colors = modes[mode]
    styles[`&.theme-ui-${mode}`] = {
      color: colors.text,
      bg: colors.background,
    }
  })

  return css({
    body: {
      ...styles,
      color: 'text',
      bg: 'background',
    },
  })(theme)
}

export const ColorMode = () => {
  const { colorMode } = useContext(Context)
  useEffect(() => {
    if (!colorMode) return
    storage.set(colorMode)
  }, [ colorMode ])

  return jsx(Global, { styles: bodyColor })
}

