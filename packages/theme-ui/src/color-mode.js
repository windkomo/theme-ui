import {
  createElement as jsx,
  useContext,
  useEffect,
} from 'react'
import { css } from '@styled-system/css'
import { Global } from '@emotion/core'
import { Context } from './context'
import storage from './storage'

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

