// refactored stateful theme provider
import jsx from './jsx'
import { useContext, useReducer } from 'react'
import { ThemeContext as Emotion } from '@emotion/core'
import { MDXProvider } from '@mdx-js/react'
import merge from 'lodash.merge'
import styled from '@emotion/styled'
import themed from './themed'
import { Context } from './context'

const Provider = ({ context, children }) =>
  jsx(Emotion.Provider, { value: context.theme },
    jsx(MDXProvider, { components: context.components },
      jsx(Context.Provider, { value: context },
        children
      )
    )
  )

const reducer = (state, next) => merge({}, state, next)

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
  colors: merge({}, theme.colors, {
    colors: get(theme, `colors.modes.${colorMode}`, {})
  })
})

const useThemeContext = ({ theme, components }) => {
  const outer = useContext(Context)

  const colorMode = outer.colorMode || theme.initialColorMode

  const [ state, setState ] = useReducer(reducer,
    merge(outer, {
      theme,
      components: createComponents(components),
      colorMode,
    })
  )

  const context = {
    ...state,
    setState,
    theme: applyColorMode(state.theme, state.colorMode),
    setColorMode: colorMode => setState({ colorMode }),
    setTheme: theme => setState({ theme }),
  }

  return context
}

export const ThemeProvider = ({
  theme,
  components,
  children,
}) => {
  const context = useThemeContext({ theme, components })

  return jsx(Provider, { context, children })
}
