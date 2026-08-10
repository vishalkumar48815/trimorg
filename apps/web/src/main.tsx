import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppProviders } from '@/app-providers';
import { ThemeProvider } from '@/theme/theme-provider';
import './index.css';
import { App } from './App.tsx';

// index.html defines #root and is never modified at runtime, so this element always exists.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppProviders>
          <TooltipProvider delayDuration={200}>
            <App />
          </TooltipProvider>
        </AppProviders>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
