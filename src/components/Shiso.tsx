'use client';
import { ReactNode, createContext } from 'react';

export interface ShisoConfig {
  contentDir: string;
  docs?: { [key: string]: any };
  blog?: { [key: string]: any };
}

export interface ShisoProps {
  config: ShisoConfig;
  children: ReactNode;
}

export const ShisoContext = createContext({ config: {} as ShisoConfig });

export function Shiso({ config, children }: ShisoProps) {
  return <ShisoContext.Provider value={{ config }}>{children}</ShisoContext.Provider>;
}
