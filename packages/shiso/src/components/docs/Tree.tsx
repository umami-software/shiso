import {
  Children,
  type CSSProperties,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from 'react';
import {
  ChevronRight,
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen,
} from '@/components/icons';
import { styles } from './styles';

export interface TreeFolderProps {
  name: string;
  defaultOpen?: boolean;
  /** When false the folder renders statically (no toggle). Defaults to true. */
  openable?: boolean;
  highlight?: boolean;
  children?: ReactNode;
}

export interface TreeFileProps {
  name: string;
  highlight?: boolean;
}

export interface TreeProps {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

function elementText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(elementText).join('');
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return elementText(node.props.children);
  }
  return '';
}

function isListElement(node: ReactNode): node is ReactElement<{ children?: ReactNode }> {
  return isValidElement(node) && (node.type === 'ul' || node.type === 'ol');
}

/** Stable key for MDX-generated list wrappers (static content, never reordered). */
function listFingerprint(node: ReactNode): string {
  const text = elementText(node).replace(/\s+/g, ' ').trim().slice(0, 64);
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return `mdx-list-${text.length}-${hash}`;
}

/** Split an MDX <li> into its label (inline content) and an optional nested list. */
function splitListItem(li: ReactElement<{ children?: ReactNode }>): {
  label: string;
  nested: ReactNode;
} {
  let nested: ReactNode = null;
  const labelParts: ReactNode[] = [];

  Children.forEach(li.props.children, child => {
    if (isListElement(child)) {
      nested = child;
    } else {
      labelParts.push(child);
    }
  });

  return { label: elementText(labelParts).trim(), nested };
}

function ListItemsAsNodes({ items }: { items: ReactNode }): ReactNode {
  const nodes: ReactNode[] = [];
  let index = 0;

  Children.forEach(items, li => {
    if (!isValidElement<{ children?: ReactNode }>(li) || li.type !== 'li') {
      return;
    }
    const { label, nested } = splitListItem(li);
    if (!label && !nested) {
      return;
    }
    const name = label || 'untitled';
    const isFolder = name.endsWith('/') || Boolean(nested);
    index += 1;

    if (isFolder) {
      nodes.push(
        <TreeFolder key={`${name}-${index}`} name={name} defaultOpen={Boolean(nested)}>
          {nested ? (
            <ListItemsAsNodes
              items={(nested as ReactElement<{ children?: ReactNode }>).props.children}
            />
          ) : null}
        </TreeFolder>,
      );
    } else {
      nodes.push(<TreeFile key={`${name}-${index}`} name={name} />);
    }
  });

  return <>{nodes}</>;
}

function containsList(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, child => {
    if (isListElement(child)) {
      found = true;
    }
  });
  return found;
}

export function TreeFolder({
  name,
  defaultOpen = false,
  openable = true,
  highlight = false,
  children,
}: TreeFolderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const expanded = openable ? open : true;
  const Icon = expanded ? FolderOpen : FolderIcon;

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: keyboard focus is delegated to the row button inside this treeitem
    <li
      role="treeitem"
      aria-expanded={openable ? expanded : undefined}
      data-highlight={highlight ? '' : undefined}
      className={styles.treeItem}
    >
      {openable ? (
        <button
          type="button"
          data-tree-focus
          onClick={() => setOpen(value => !value)}
          className={`${styles.treeRow} ${highlight ? styles.treeHighlight : ''}`}
        >
          <ChevronRight
            size={14}
            className={styles.treeChevron}
            data-open={expanded ? '' : undefined}
            aria-hidden={true}
          />
          <Icon size={15} className={styles.treeIcon} aria-hidden={true} />
          <span className={styles.treeName}>{name}</span>
        </button>
      ) : (
        <span
          data-tree-focus
          tabIndex={-1}
          className={`${styles.treeRow} ${highlight ? styles.treeHighlight : ''}`}
        >
          <Icon size={15} className={styles.treeIcon} aria-hidden={true} />
          <span className={styles.treeName}>{name}</span>
        </span>
      )}
      {children ? (
        // biome-ignore lint/a11y/useSemanticElements: group is the required ARIA role for nested tree levels
        <ul
          role="group"
          hidden={openable && !expanded ? true : undefined}
          className={styles.treeGroup}
        >
          {children}
        </ul>
      ) : null}
    </li>
  );
}

export function TreeFile({ name, highlight = false }: TreeFileProps) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: file rows are arrow-key targets in the tree widget
    <li role="treeitem" data-highlight={highlight ? '' : undefined} className={styles.treeItem}>
      <span
        data-tree-focus
        tabIndex={-1}
        className={`${styles.treeRow} ${highlight ? styles.treeHighlight : ''}`}
      >
        <FileIcon size={15} className={styles.treeIcon} aria-hidden={true} />
        <span className={styles.treeName}>{name}</span>
      </span>
    </li>
  );
}

function visibleFocusables(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('[data-tree-focus]')].filter(
    element => !element.closest('[hidden]'),
  );
}

function TreeRoot({ children, style, className }: TreeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef({ text: '', timer: 0 });

  const onKeyDown = (event: KeyboardEvent) => {
    const root = rootRef.current;
    const target = event.target as HTMLElement;
    if (!root || !target.closest('[data-tree-focus]')) {
      return;
    }

    const items = visibleFocusables(root);
    const index = items.indexOf(target as HTMLElement);

    const focusAt = (next: number) => {
      event.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    };

    switch (event.key) {
      case 'ArrowDown':
        focusAt(index + 1);
        break;
      case 'ArrowUp':
        focusAt(index - 1);
        break;
      case 'Home':
        focusAt(0);
        break;
      case 'End':
        focusAt(items.length - 1);
        break;
      case 'ArrowRight': {
        const row = target.closest('[role="treeitem"]');
        const toggle = row?.querySelector<HTMLElement>(':scope > [data-tree-focus]');
        if (
          toggle &&
          toggle.tagName === 'BUTTON' &&
          toggle.getAttribute('aria-expanded') === 'false'
        ) {
          event.preventDefault();
          toggle.click();
        } else {
          const firstChild = row?.querySelector<HTMLElement>(':scope > ul [data-tree-focus]');
          if (firstChild) {
            event.preventDefault();
            firstChild.focus();
          }
        }
        break;
      }
      case 'ArrowLeft': {
        const row = target.closest('[role="treeitem"]');
        const toggle = row?.querySelector<HTMLElement>(':scope > [data-tree-focus]');
        if (
          toggle &&
          toggle.tagName === 'BUTTON' &&
          toggle.getAttribute('aria-expanded') === 'true'
        ) {
          event.preventDefault();
          toggle.click();
        } else {
          const parent = row?.parentElement?.closest('[role="treeitem"]');
          const parentFocus = parent?.querySelector<HTMLElement>(':scope > [data-tree-focus]');
          if (parentFocus) {
            event.preventDefault();
            parentFocus.focus();
          }
        }
        break;
      }
      case '*': {
        // Expand all sibling folders at the current level.
        const group = target.closest('ul');
        group
          ?.querySelectorAll<HTMLElement>(
            ':scope > [role="treeitem"] > button[aria-expanded="false"]',
          )
          .forEach(button => {
            button.click();
          });
        break;
      }
      default: {
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          const state = searchRef.current;
          window.clearTimeout(state.timer);
          state.text += event.key.toLowerCase();
          state.timer = window.setTimeout(() => {
            state.text = '';
          }, 500);
          const match = items.find(item =>
            (item.textContent || '').trim().toLowerCase().startsWith(state.text),
          );
          if (match) {
            event.preventDefault();
            (match as HTMLElement).focus();
          }
        }
      }
    }
  };

  const content = containsList(children)
    ? Children.map(children, child =>
        isListElement(child) ? (
          <ListItemsAsNodes
            key={listFingerprint(child)}
            items={(child as ReactElement<{ children?: ReactNode }>).props.children}
          />
        ) : (
          child
        ),
      )
    : children;

  // Buttons (folders) stay in the tab order natively; file rows are reached
  // with arrow keys.
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: key handling for the tree widget lives on its root
    <div
      ref={rootRef}
      style={style}
      className={`${styles.tree} ${className || ''}`}
      onKeyDown={onKeyDown}
    >
      {/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: tree is the required ARIA role for this widget */}
      <ul role="tree" aria-label="File tree" className={styles.treeList}>
        {content}
      </ul>
    </div>
  );
}

export function Tree(props: TreeProps) {
  return <TreeRoot {...props} />;
}

/** Alias: <Tree> and <FileTree> are interchangeable, like Mintlify. */
export function FileTree(props: TreeProps) {
  return <TreeRoot {...props} />;
}

Tree.Folder = TreeFolder;
Tree.File = TreeFile;
FileTree.Folder = TreeFolder;
FileTree.File = TreeFile;

export const FileTreeFolder = TreeFolder;
export const FileTreeFile = TreeFile;
