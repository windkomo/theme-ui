import { transformSync } from '@babel/core'
import jsx from '../src/jsx'

const fixture = `/** @jsx jsx */
import { jsx } from 'theme-ui'

export default props =>
  <div
    {...props}
    css={{
      m: 0,
      bg: 'primary',
    }}
  />
`

test('converts css prop to @styled-system/css call', () => {
  const { code } = transformSync(fixture, {
    presets: [
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
    ],
  })
  expect(code).toMatchSnapshot()
})

test('works with emotion preset', () => {
  const { code } = transformSync(fixture, {
    presets: [
      '@emotion/babel-preset-css-prop',
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
    ],
  })
  expect(code).toMatch(/bg: \'primary\',/)
  expect(code).toMatch(/m: 0,/)
  // console.log(code)
  // expect(code).toMatchSnapshot()
})
