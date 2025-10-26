import { useContext } from 'react';
import { ShisoContext } from '../Shiso';

export function useShiso() {
  return useContext(ShisoContext);
}
