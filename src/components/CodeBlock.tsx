import { useState, useRef } from 'react';
import { Icon, Icons } from '@umami/react-zen';
import { JetBrains_Mono } from 'next/font/google';
import styles from './CodeBlock.module.css';
import classNames from 'classnames';

const mono = JetBrains_Mono({ subsets: ['latin'] });

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
    <pre ref={textInput} className={classNames(styles.container, mono.className, 'dark-theme')}>
      {props.children}
      <button aria-label="Copy code" className={styles.button} onClick={handleCopy}>
        <Icon size="sm" className={copied ? styles.check : styles.copy}>
          {copied ? <Icons.Check /> : <Icons.Copy />}
        </Icon>
      </button>
    </pre>
  );
}
