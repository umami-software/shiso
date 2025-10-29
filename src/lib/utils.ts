export function formatBookmark(name: string) {
  return name
    ?.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}
