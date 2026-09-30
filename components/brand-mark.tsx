import { Briefcase } from "@phosphor-icons/react";

export function BrandMark({ size = 28 }: { size?: number }) {
  const iconSize = size * 0.5625;
  
  return (
    <span
      className="relative flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "rgb(var(--color-surface))",
        borderRadius: "31.25%",
        boxShadow: "var(--neu-shadow-sm)",
      }}
      aria-hidden="true"
    >
      <Briefcase size={iconSize} weight="duotone" style={{ color: "rgb(var(--color-primary))" }} />
    </span>
  );
}