export async function GET() {
  const svg = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6.5" fill="#1c1c1e" /><g stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M12 11.5V9C12 7.89543 12.8954 7 14 7H18C19.1046 7 20 7.89543 20 9V11.5" /><rect x="5.5" y="11.5" width="21" height="14.5" rx="3.5" /><path d="M11 17.5L14.5 21L21 14.5" /></g></svg>`;

  return new Response(svg, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "image/svg+xml",
    },
  });
}