export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-[var(--radius-sm)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="block h-full w-full" role="presentation">
        <rect width="32" height="32" rx="8" fill="rgb(var(--color-primary))" />
        <rect x="8" y="8" width="16" height="19" rx="2.5" fill="rgb(var(--color-on-primary))" />
        <rect x="11" y="5" width="10" height="6" rx="2" fill="rgb(var(--color-on-primary))" />
        <path d="M11 15h3.5l1.5 1.5 3-3 1.5 1.5-4.5 4.5-2.5-2.5H11zM11 22h10" fill="none" stroke="rgb(var(--color-primary))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}