// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'
import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/700.css'
import { Button } from "./button"

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

export const theme = extendTheme({
  colors: {
    brand: {
      100: '#FF3c00'
    }
  },
  fonts: {
    body: 'Open sans, sans-serif'
  },
  styles: {
    global: () => ({
      body: {
        bg: 'gray.200'
      }
    })
  },
  components: {
    Button
  }
})