const remarkPlugins = [
  require('remark-slug'),
]

module.exports = {
  __experimentalThemes: [],
  plugins: [
    // 'gatsby-plugin-theme-ui',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [ '.mdx', '.md' ],
        remarkPlugins,
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              aliases: {
                sh: 'bash',
                js: 'javascript',
              },
              noInlineHighlight: true,
            }
          },
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Poppins:500,800',
          'Roboto Mono:400,700',
        ]
      }
    },
  ]
}
