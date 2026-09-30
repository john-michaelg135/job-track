import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const ACCENT_COLORS = {
  coral: "#eb5757",
  indigo: "#6366f1",
  teal: "#0d9488",
  rose: "#e11d48",
  amber: "#b45309",
  emerald: "#059669",
  pink: "#ec4899",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  lime: "#84cc16",
  fuchsia: "#d946ef",
  salmon: "#ff91a4",
} as const;

export async function GET() {
  const accent = (await cookies()).get("jt-accent")?.value as keyof typeof ACCENT_COLORS | undefined;
  const color = ACCENT_COLORS[accent ?? "coral"] ?? ACCENT_COLORS.coral;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" fill="none"><rect width="256" height="256" fill="#f4f6f8" rx="80" ry="80"/><g transform="translate(56, 56) scale(0.5625)"><path d="M224,118.31V200a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V118.31h0A191.14,191.14,0,0,0,128,144,191.08,191.08,0,0,0,224,118.31Z" opacity="0.2" fill="${color}"/><path d="M104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112ZM232,72V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V72A16,16,0,0,1,40,56H80V48a24,24,0,0,1,24-24h48a24,24,0,0,1,24,24v8h40A16,16,0,0,1,232,72ZM96,56h64V48a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8ZM40,72v41.62A184.07,184.07,0,0,0,128,136a184,184,0,0,0,88-22.39V72ZM216,200V131.63A200.25,200.25,0,0,1,128,152a200.19,200.19,0,0,1-88-20.36V200H216Z" fill="${color}"/></g></svg>`;

  return new Response(svg, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "image/svg+xml",
    },
  });
}