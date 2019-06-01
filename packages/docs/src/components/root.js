import React, { useState } from 'react'
import { ThemeProvider, ColorMode } from 'theme-ui'
import components from './mdx-components'
import { Context } from './context'
import defaultTheme from '../theme'

const themes = {
  default: defaultTheme,
  spicy: {
    ...defaultTheme,
    colors: {
      text: 'white',
      background: 'red',
      modes: {},
    },
    fonts: {
      body: 'Menlo, monospace',
      heading: 'fantasy',
    },
  },
}

export default props => {
  const [ theme, setTheme ] = useState('default')
  const context = {
    theme,
    setTheme,
  }
  console.log(theme, themes[theme])

  return (
    <Context.Provider value={context}>
      <ThemeProvider
        theme={themes[theme]}
        components={components}>
        <ColorMode />
        {props.children}
      </ThemeProvider>
    </Context.Provider>
  )
}
