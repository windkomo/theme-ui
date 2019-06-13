import {
  createElement as jsx,
  useContext,
  useReducer,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react'
import { ThemeContext as Emotion } from '@emotion/core'
import { MDXProvider } from '@mdx-js/react'
import merge from 'lodash.merge'
import { get } from '@styled-system/css'
import { Context } from './context'
import storage from './storage'
import { ColorMode } from './color-mode'

const reducer = (state, next) => merge({}, state, next)

// new: stateful theme + window.__THEME_UI
// breaking: does not accept props.components
export const ThemeProvider = props => {
  const outer = useContext(Context)
  const [ theme, setTheme ] = useReducer(reducer, props.theme)

  const [ colorMode, setColorMode ] = useState(props.theme.initialColorMode)

  const context = merge({
    colorMode,
    setColorMode,
  }, outer, {
    theme,
    setTheme,
  })
  console.log(context.theme)

  context.theme = {
    ...theme,
    colors: merge({}, theme.colors, get(theme, `colors.modes.${context.colorMode}`))
  }

  useEffect(() => {
    window.__THEME_UI = window.__THEME_UI || context
  }, [])

  useLayoutEffect(() => {
    const stored = storage.get()
    document.body.classList.remove('theme-ui-' + stored)
    if (!stored) return
    setColorMode(stored)
  }, [])

  return jsx(Emotion.Provider, { value: context.theme },
    jsx(MDXProvider, { components: context.components },
      jsx(Context.Provider, { value: context },
        jsx(ColorMode, { key: 'color-mode' }),
        props.children
      )
    )
  )
}

ThemeProvider.defaultProps = {
  theme: {}
}

export default ThemeProvider
