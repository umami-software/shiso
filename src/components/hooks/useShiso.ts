import { useContext } from 'react';
import { ShisoContext } from '../Shiso';

export function useShiso() {
  const context = useContext(ShisoContext);

  if (!context) {
    throw new Error('useShiso must be used within ShisoContext.Provider');
  }

  const { content, config } = context;

  return { content, config };
}
