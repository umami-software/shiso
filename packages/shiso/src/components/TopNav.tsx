import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router';
import { ConfiguredIcon } from '@/components/ConfiguredIcon';
import { ChevronRight } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DocsTab, LinkTarget, NavNode, NormalizedDocsConfig } from '@/lib/types';

interface MenuLink {
  label: string;
  href: string;
  target: LinkTarget;
  routed: boolean;
}

function collectMenuLinks(nodes: NavNode[]): MenuLink[] {
  const links: MenuLink[] = [];

  for (const node of nodes) {
    if (node.kind === 'page') {
      if (!node.page.hidden) {
        links.push({ label: node.page.label, href: node.page.url, target: '_self', routed: true });
      }
    } else if (node.kind === 'link') {
      if (!node.hidden) {
        links.push({ label: node.label, href: node.href, target: node.target, routed: false });
      }
    } else if (!node.hidden) {
      if (node.root && !node.root.page.hidden) {
        links.push({
          label: node.root.page.label,
          href: node.root.page.url,
          target: '_self',
          routed: true,
        });
      }
      links.push(...collectMenuLinks(node.children));
    }
  }

  return links;
}

export function TopNav({ docs, label }: { docs: NormalizedDocsConfig; label: string }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tabs = docs.tabs.filter(tab => !tab.hidden);

  if (!tabs.length) {
    return null;
  }

  const page = docs.pages.find(item => item.url === pathname);
  const selected =
    page?.tabId ||
    [...tabs]
      .sort((a, b) => b.url.length - a.url.length)
      .find(tab => pathname === tab.url || pathname.startsWith(`${tab.url}/`))?.id ||
    tabs[0]?.id;
  const tabClass = (tab: DocsTab) =>
    cn(
      'flex h-full items-center gap-1 whitespace-nowrap border-transparent border-b-2 font-medium',
      {
        'border-b-primary text-foreground': tab.id === selected,
        'text-muted-foreground hover:text-foreground': tab.id !== selected,
      },
    );

  return (
    <nav
      className="hidden h-[calc(100%+1px)] max-w-screen self-start items-center gap-7 overflow-x-auto text-sm [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden"
      aria-label={label}
    >
      {tabs.map(tab => {
        if (tab.presentation === 'dropdown') {
          const menuLinks = collectMenuLinks(docs.navigation[tab.id] || []);

          return (
            <DropdownMenu key={tab.id}>
              <DropdownMenuTrigger render={<button type="button" className={tabClass(tab)} />}>
                <ConfiguredIcon icon={tab.icon} />
                {tab.label}
                <ChevronRight className="size-3.5 rotate-90" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-48">
                {menuLinks.map(item => (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => {
                      if (item.routed) {
                        navigate(item.href);
                      } else {
                        window.open(
                          item.href,
                          item.target,
                          item.target === '_blank' ? 'noreferrer' : undefined,
                        );
                      }
                    }}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Link
            key={tab.id}
            to={tab.url}
            className={tabClass(tab)}
            aria-current={tab.id === selected ? 'page' : undefined}
          >
            <ConfiguredIcon icon={tab.icon} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
