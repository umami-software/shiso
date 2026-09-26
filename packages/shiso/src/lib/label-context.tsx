import { createContext, useContext } from 'react';
import { englishLabels } from '@/lib/labels';

export const LabelContext = createContext(englishLabels);
export function useLabels() {
  return useContext(LabelContext);
}
