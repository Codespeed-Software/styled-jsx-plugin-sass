const sass = require('sass')
const stripIndent = require('strip-indent')

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%%(\w*[ ),;!{])/g,
      (_, id, p1) => `styled-jsx-percent-placeholder-${id}-${p1}`
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%(\w*[ ),;!{])/g,
      (_, id, p1) => `styled-jsx-placeholder-${id}-${p1}`
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%%/g,
      (_, id) => `/*%%styled-jsx-percent-placeholder-${id}%%*/`
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%/g,
      (_, id) => `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  // Prepend option data to cssWithPlaceholders
  const optionData = (settings.sassOptions && settings.sassOptions.data) || ''
  // clean up extra indent (indentedSyntax is not compatible with extra indenting)
  // they need to be cleaned up separately, and then concatenated
  const data = stripIndent(optionData) + '\n' + stripIndent(cssWithPlaceholders)
  const file = settings.babel && settings.babel.filename

  const preprocessed = sass
    .renderSync(
      Object.assign(
        {},
        settings.sassOptions,
        {
          file,
          silenceDeprecations: ['legacy-js-api'],
          data
        },
      )
    )
    .css.toString()
  // .compileString(data, {loadPaths: ['styles/', 'core/styles/'], includePaths: ['styles/', 'core/styles/']}) // should switch to this soon

  return preprocessed
    .replace(
      /styled-jsx-percent-placeholder-(\d+)-(\w*[ ),;!{])/g,
      (_, id, p1) => `%%styled-jsx-placeholder-${id}%%%${p1}`
    )
    .replace(
      /styled-jsx-placeholder-(\d+)-(\w*[ ),;!{])/g,
      (_, id, p1) => `%%styled-jsx-placeholder-${id}%%${p1}`
    )
    .replace(
      /\/\*%%styled-jsx-percent-placeholder-(\d+)%%\*\//g,
      (_, id) => `%%styled-jsx-placeholder-${id}%%%`
    )
    .replace(
      /\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g,
      (_, id) => `%%styled-jsx-placeholder-${id}%%`
    )
}
