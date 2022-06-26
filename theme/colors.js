const lightThemeText = 'hsl(10, 20%, 20%)'
const lightThemeBackground = 'hsl(10, 10%, 98%)'
const lightThemePrimary = 'hsl(10, 80%, 50%)'
const lightThemeSecondary = 'hsl(10, 60%, 50%)'
const lightThemeMuted = 'hsl(10, 20%, 94%)'
const lightThemeHighlight = 'hsl(10, 40%, 90%)'
const lightThemeGray = 'hsl(10, 20%, 50%)'
const lightThemePurple = 'hsl(250, 60%, 30%)'

const darkThemeText = '#fff'
const darkThemeBackground = '#060606'
const darkThemePrimary = '#3cf'
const darkThemeSecondary = '#e0f'
const darkThemeMuted = '#191919'
const darkThemeHighlight = '#29112c'
const darkThemeGray = '#999'
const darkThemePurple = '#c0f'

const colors = {
  text: lightThemeText,
  background: lightThemeBackground,
  primary: lightThemePrimary,
  secondary: lightThemeSecondary,
  muted: lightThemeMuted,
  highlight: lightThemeHighlight,
  gray: lightThemeGray,
  purple: lightThemePurple,
  modes: {
    dark: {
      text: darkThemeText,
      background: darkThemeBackground,
      primary: darkThemePrimary,
      secondary: darkThemeSecondary,
      muted: darkThemeMuted,
      highlight: darkThemeHighlight,
      gray: darkThemeGray,
      purple: darkThemePurple,
    },
  },
}

export default colors
