import type { ReactNode } from 'react';
import { ChevronRight } from '@/components/icons';
import styles from './docs.module.css';

export interface ExampleProps {
  title?: ReactNode;
  children?: ReactNode;
}

function ExampleBlock({ title, children }: ExampleProps) {
  return (
    <div className={styles.example}>
      <div className={styles.exampleHeader}>
        <ChevronRight size={14} />
        {title}
      </div>
      <div className={styles.exampleBody}>{children}</div>
    </div>
  );
}

export type RequestExampleProps = ExampleProps;

export function RequestExample({ title = 'Request example', children }: RequestExampleProps) {
  return <ExampleBlock title={title}>{children}</ExampleBlock>;
}

export type ResponseExampleProps = ExampleProps;

export function ResponseExample({ title = 'Response example', children }: ResponseExampleProps) {
  return <ExampleBlock title={title}>{children}</ExampleBlock>;
}
