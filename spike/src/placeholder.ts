// placeholder.ts — stand-in imagery via https://placehold.co/. Built into the
// tool so prototypes never commit binary assets, which keeps the repo lean even
// with many prototypes. Real assets replace these only when a system ships them.

export function placeholderImage(width: number, height: number, label?: string): string {
  const base = `https://placehold.co/${width}x${height}`;
  return label ? `${base}?text=${encodeURIComponent(label)}` : base;
}
