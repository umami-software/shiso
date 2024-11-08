import Callout from './Callout';

export function Note({ children }: { children: React.ReactNode }) {
  return <Callout variant="note">{children}</Callout>;
}
