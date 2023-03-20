import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: { verticalAlign: 'middle' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { color: 'inherit' },
      },
    },
  },
})
