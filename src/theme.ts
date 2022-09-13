import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme
} from '@chakra-ui/react'

const theme = extendTheme(
  {
    config: {
      useSystemColorMode: true
    },
    colors: {
      brand: baseTheme.colors.purple
    }
  },
  withDefaultColorScheme({ colorScheme: 'brand' })
)

export default theme

// const theme = (mode: PaletteMode) =>
//   createTheme({
//     palette: {
//       mode,
//       primary: {
//         light: '#9795dd',
//         main: '#6767ab',
//         dark: '#383d7b',
//         contrastText: '#fff'
//       }
//     },
//     breakpoints: {
//       values: {
//         xs: 0,
//         sm: 600,
//         md: 980,
//         lg: 1200,
//         xl: 1536
//       }
//     }
//   })

// export default theme
