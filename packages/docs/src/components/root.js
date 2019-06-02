import React, { useState } from 'react'
import { ThemeProvider, ColorMode } from 'theme-ui'
import merge from 'lodash.merge'
import { Context } from './context'
import components from './mdx-components'
import themes from '../themes'

const themeNames = Object.keys(themes)

export default props => {
  const [ theme, setTheme ] = useState('default')
  const merged = merge({}, themes.default, themes[theme])
  const context = {
    theme,
    setTheme,
    themes: themeNames,
    cycleTheme: () => {
      const i = (themeNames.indexOf(theme) + 1) % themeNames.length
      setTheme(themeNames[i])
    }
  }

  return (
    <Context.Provider value={context}>
      <ThemeProvider
        theme={merged}
        components={components}>
        <ColorMode />
        {props.children}
      </ThemeProvider>
    </Context.Provider>
  )
}
