import { useState, useRef } from 'react';
import classNames from 'classnames';
import { Icon } from '@umami/react-zen';
import { Check, Copy } from '@/components/icons';
import styles from './CodeBlock.module.css';

export function CodeBlock(props: any) {
  const textInput = useRef<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);

    navigator?.clipboard?.writeText(textInput?.current?.textContent);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <pre ref={textInput} className={classNames(styles.container, 'dark-theme')}>
      {props.children}
      <button aria-label="Copy code" className={styles.button} onClick={handleCopy}>
        <Icon size="sm" className={copied ? styles.check : styles.copy}>
          {copied ? <Check /> : <Copy />}
        </Icon>
      </button>
    </pre>
  );
}
