import { BrowserRouter } from 'react-router';
import { App } from '@/App';
import { BASE_URL } from '@/lib/paths';

export function ShisoApp() {
  return (
    <BrowserRouter basename={BASE_URL || undefined}>
      <App />
    </BrowserRouter>
  );
}
