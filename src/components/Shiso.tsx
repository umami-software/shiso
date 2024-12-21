import { ReactNode, createContext } from 'react';
export interface ShisoConfig {
  contentDir: string;
  docs?: { [key: string]: any };
  blog?: { [key: string]: any };
}

export interface ShisoProps {
  content: string;
  type: string;
  config: ShisoConfig;
  components?: { [key: string]: any };
  children: ReactNode;
}

export const ShisoContext = createContext(null as any);

export function Shiso({ content, type, config, components, children }: ShisoProps) {
  return (
    <ShisoContext.Provider value={{ content, type, config, components }}>
      {children}
    </ShisoContext.Provider>
  );
}
