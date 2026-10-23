import type { ReactNode } from "react";

const shapes = {
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  upRight: (
    <>
      <path d="M6 18 18 6M6 6h12v12" />
    </>
  ),
  down: (
    <>
      <path d="M12 4v16M6 14l6 6 6-6" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7v10H3Z" />
      <path d="M9 20v-7h6v7" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </>
  ),
  spark: (
    <>
      <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="4" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pause: (
    <>
      <path d="M8 5v14M16 5v14" />
    </>
  ),
  play: (
    <>
      <path d="m8 4 12 8-12 8Z" />
    </>
  ),
  github: (
    <>
      <path
        d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3.3-.4 6.8-1.6 6.8-7a5.4 5.4 0 0 0-1.5-3.8A5 5 0 0 0 19.1.5S17.9.1 15 2a13 13 0 0 0-7 0C5.1.1 3.9.5 3.9.5a5 5 0 0 0-.2 3.7A5.4 5.4 0 0 0 2.2 8c0 5.4 3.5 6.6 6.8 7a3.5 3.5 0 0 0-1 3v4"
        transform="translate(1 1) scale(.9)"
      />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="13" rx="3" />
      <path d="M15 8V5a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h3" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L19 6" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof shapes;
export default function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}

export function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 7v50M7 32h50M14.3 14.3l35.4 35.4M14.3 49.7l35.4-35.4"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="8" fill="currentColor" />
    </svg>
  );
}
