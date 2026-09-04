import { createContext, type ReactNode, useContext, useState } from 'react';

interface PanelContextValue {
  content: ReactNode;
  setContent: (content: ReactNode) => void;
}

const PanelContext = createContext<PanelContextValue>({
  content: null,
  setContent: () => {},
});

export function PanelProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);

  return <PanelContext.Provider value={{ content, setContent }}>{children}</PanelContext.Provider>;
}

export function usePanelContent(): ReactNode {
  return useContext(PanelContext).content;
}

export function useSetPanelContent(): (content: ReactNode) => void {
  return useContext(PanelContext).setContent;
}
