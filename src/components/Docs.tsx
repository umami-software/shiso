import Markdown from './Markdown';
import PageLinks from './PageLinks';
import Menu from './Menu';
import Tabs from './Tabs';
import styles from './Docs.module.css';

export interface DocsProps {
  doc: any;
  config: any;
}

export default function Docs({ doc, config }: DocsProps) {
  return (
    <div className={styles.docs}>
      <Tabs config={config} />
      <div className={styles.main}>
        <Menu config={config} />
        <div className={styles.content}>
          <div className={styles.group}>{doc?.group?.group}</div>
          <h1>{doc?.meta?.title}</h1>
          <p className={styles.description}>{doc?.meta?.description}</p>
          <Markdown>{doc?.body}</Markdown>
        </div>
        <PageLinks items={doc?.anchors} offset={150} />
      </div>
    </div>
  );
}
