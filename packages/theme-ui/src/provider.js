// refactored stateful theme provider
import jsx from './jsx'
import {
  useContext,
  useReducer,
  useEffect
} from 'react'
import styled from '@emotion/styled'
import { ThemeContext as Emotion } from '@emotion/core'
import { MDXProvider } from '@mdx-js/react'
import { get } from '@styled-system/css'
import merge from 'lodash.merge'
import themed from './themed'
import { Context } from './context'

const IS_DEV = process.env.NODE_ENV !== 'production'

const Provider = ({ context, children }) =>
  jsx(Emotion.Provider, { value: context.theme },
    jsx(MDXProvider, { components: context.components },
      jsx(Context.Provider, { value: context },
        children
      )
    )
  )

/*
 * - [ ] initialize color mode
 * - [ ] color mode state
 * - [ ] theme state
 * - [ ] merge outer
 * - [ ] create components
 * - [ ] set color mode
 * - [ ] support nesting
 * - [ ] color mode side effects
 */

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

const useStoredColorMode = ({ colorMode, setColorMode }, isNested) => {
  useEffect(() => {
    if (isNested) return
    const stored = storage.get()
    document.body.classList.remove('theme-ui-' + stored)
    if (!stored || stored === colorMode) return
    setColorMode(stored)
  }, [])

  useEffect(() => {
    if (!colorMode || isNested) return
    storage.set(colorMode)
  }, [colorMode])
}

const reducer = (state, next) => merge({}, state, next)

const useThemeContext = ({ theme, components }) => {
  const outer = useContext(Context)
  const isNested = !!outer.setTheme

  const colorMode = outer.colorMode || theme.initialColorMode
  const merged = merge({
    colorMode,
  }, outer, {
    theme,
    components: createComponents(components)
  })
  merged.theme = applyColorMode(merged.theme, merged.colorMode)

  const [ state, setState ] = useReducer(reducer, merged)

  const context = {
    ...state,
    theme: applyColorMode(state.theme, state.colorMode),
    setTheme: theme => setState({ theme }),
    setColorMode: colorMode => setState({ colorMode }),
  }

  useStoredColorMode(context, isNested)

  useEffect(() => {
    console.log('effect')
    // does this need a browser check?
    if (IS_DEV) {
      console.log('define global')
      window.__THEME_UI__ = context
    }
  }, [])

  // nested context is not stateful
  if (isNested) return merged

  console.log(context)

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
