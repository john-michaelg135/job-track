export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="relative block shrink-0 overflow-visible"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="block h-full w-full drop-shadow-sm" role="presentation">
        {/* Dark Squircle Background */}
        <rect width="32" height="32" rx="6.5" fill="#1c1c1e" />
        {/* Icon Symbol */}
        <g stroke="rgb(var(--color-primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Briefcase Handle */}
          <path d="M12 11.5V9C12 7.89543 12.8954 7 14 7H18C19.1046 7 20 7.89543 20 9V11.5" />
          {/* Briefcase Body */}
          <rect x="5.5" y="11.5" width="21" height="14.5" rx="3.5" />
          {/* Checkmark inside */}
          <path d="M11 17.5L14.5 21L21 14.5" />
        </g>
      </svg>
    </span>
  );
}