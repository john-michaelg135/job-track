import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1c1c1e',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 11.5V9C12 7.89543 12.8954 7 14 7H18C19.1046 7 20 7.89543 20 9V11.5" />
            <rect x="5.5" y="11.5" width="21" height="14.5" rx="3.5" />
            <path d="M11 17.5L14.5 21L21 14.5" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
