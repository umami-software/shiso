import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from '@/App';
import { BASE_URL } from '@/lib/paths';

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <BrowserRouter basename={BASE_URL || undefined}>
    <App />
  </BrowserRouter>,
);
