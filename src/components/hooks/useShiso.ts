import { useContext } from 'react';
import { ShisoContext } from '../Shiso';

export function useShiso() {
  const { content, config } = useContext(ShisoContext);

  return { content, config };
}
