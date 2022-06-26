import colors from './colors'
import styles from './styles'

const fonts = `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Helvetica, sans-serif`

const index = {
  config: {
    useCustomProperties: true,
    initialColorModeName: `light`,
    useColorSchemeMediaQuery: true,
    useLocalStorage: false,
    useRootStyles: true,
  },
  colors,
  styles,
  breakpoints: ['35rem', '47rem', '69rem', '94rem'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    copyNarrow: 512,
    copy: 700,
    layout: 1024,
    layoutPlus: 1360,
    wide: 1860,
  },
  fonts: {
    monospace: 'ui-monospace, "Roboto Mono", Menlo, Consolas, monospace',
    heading: `ui-rounded, ${fonts}`,
    body: `${fonts}`,
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
  fontWeights: {
    body: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heading: 700,
  },
  lineHeights: {
    heading: 1.125,
    body: 1.5,
    relaxed: 1.625,
    loose: 2.25,
  },
  letterSpacings: {
    body: `normal`,
    nav: `0.05em`,
    caps: `0.1em`,
    heading: `normal`,
  },
  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      letterSpacing: 'heading',
      overflowWrap: 'break-word',
      hyphens: 'auto',
      mt: 4,
      mb: 2,
      color: 'secondary',
      fontSize: [2, 3],
    },
    subheading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      letterSpacing: 'heading',
      overflowWrap: 'break-word',
      hyphens: 'auto',
      mt: 4,
      mb: 2,
      color: 'secondary',
      fontSize: [2, 3],
    },
    paragraph: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      letterSpacing: 'body',
      overflowWrap: 'break-word',
      hyphens: 'auto',
      color: 'secondary',
      fontSize: [2, 3],
    },
    title: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      letterSpacing: 'body',
      overflowWrap: 'break-word',
      hyphens: 'auto',
      color: 'secondary',
      fontSize: [2, 3],
    },
    subtitle: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      letterSpacing: 'body',
      overflowWrap: 'break-word',
      hyphens: 'auto',
      color: 'secondary',
      fontSize: [2, 3],
    },
  },
}

export default index
