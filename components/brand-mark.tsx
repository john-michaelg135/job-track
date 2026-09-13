export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-[var(--radius-sm)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="block h-full w-full" role="presentation">
        <rect width="32" height="32" rx="8" fill="rgb(var(--color-primary))" />
        <rect x="7" y="8" width="18" height="3" rx="0.75" fill="rgb(var(--color-on-primary))" />
        <rect x="7" y="14.5" width="13" height="3" rx="0.75" fill="rgb(var(--color-on-primary))" />
        <rect x="7" y="21" width="16" height="3" rx="0.75" fill="rgb(var(--color-on-primary))" />
      </svg>
    </span>
  );
}