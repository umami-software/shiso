import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from '@/App';
import { BASE_URL } from '@/lib/paths';

export function mount(element: HTMLElement | null = document.getElementById('root')) {
  if (!element) {
    throw new Error('Shiso could not find the root element.');
  }

  return hydrateRoot(
    element,
    <BrowserRouter basename={BASE_URL || undefined}>
      <App />
    </BrowserRouter>,
  );
}
