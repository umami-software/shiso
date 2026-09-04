import { type ReactNode, useEffect } from 'react';
import { useSetPanelContent } from './panel-context';
import { styles } from './styles';

export interface PanelProps {
  children?: ReactNode;
}

/**
 * Pins supplementary content to the right rail (replacing the table of
 * contents on desktop). On small screens the content renders inline where it
 * is written. Only one Panel per page is supported; the last one wins.
 */
export function Panel({ children }: PanelProps) {
  const setContent = useSetPanelContent();

  useEffect(() => {
    setContent(children ? <div className={styles.panel}>{children}</div> : null);
    return () => setContent(null);
  }, [children, setContent]);

  return <div className={styles.panelInline}>{children}</div>;
}
