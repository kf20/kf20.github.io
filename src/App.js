import React from 'react'
import Radio from './Radio'
import Logo from './Logo'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Monospace',
    ].join(','),
},});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Logo />
    </ThemeProvider>
  )
}

export default App;
