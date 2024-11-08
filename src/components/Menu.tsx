'use client';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Menu.module.css';

export interface MenuProps {
  config: any;
  onClick?: () => void;
}

export default function Menu({ config, onClick }: MenuProps) {
  const pathname = usePathname();
  const { tabs, navigation } = config;
  const tab = tabs.find(({ url, name }) => (name !== 'docs' ? pathname.startsWith(url) : false));
  const menu = navigation[tab?.name || 'docs'];

  return (
    <div className={styles.menu} onClick={onClick}>
      {menu.map(({ group, pages }) => {
        return (
          <section key={group} className={styles.items}>
            <header>{group}</header>
            {pages.map(({ label: text, url }) => {
              return (
                <div
                  key={url}
                  className={classNames(styles.item, {
                    [styles.selected]: url === pathname,
                  })}
                >
                  <Link href={url} prefetch={false}>
                    {text}
                  </Link>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
