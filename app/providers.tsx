'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  // Your custom theme here (optional)
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const cache = createCache({
    key: 'mui',
    prepend: true,        // Important for SSR
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}