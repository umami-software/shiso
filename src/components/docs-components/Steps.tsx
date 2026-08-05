import type { ReactNode } from 'react';
import { useMemo } from 'react';
import styles from './docs-components.module.css';
import { toElementArray } from './utils';

interface StepChildProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function Step({ children }: StepChildProps) {
  return <>{children}</>;
}

export interface StepsProps {
  children?: ReactNode;
}

export function Steps({ children }: StepsProps) {
  const steps = useMemo(() => {
    return toElementArray<StepChildProps>(children).map((child, index) => {
      return {
        title: child.props.title || `Step ${index + 1}`,
        content: child.props.children,
      };
    });
  }, [children]);

  if (!steps.length) {
    return null;
  }

  return (
    <div className={styles.steps}>
      {steps.map((step, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: steps are static MDX content
        <div key={`step-${index + 1}`} className={styles.step}>
          <div className={styles.stepNumber}>{index + 1}</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>{step.title}</div>
            <div>{step.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
