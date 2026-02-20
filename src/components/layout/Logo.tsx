import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// `?url` forces Vite to emit the file and give us a URL string.
interface LogoProps {
  showName?: boolean;
  className?: string;
  size?: number;
}

// Swirl + gradient wordmark for the cuircle-cart brand
export function Logo({ showName = true, className, size = 52 }: LogoProps) {
  const id = useId();
  const bladeA = `${id}-blade-a`;
  const bladeB = `${id}-blade-b`;
  const haloId = `${id}-halo`;

  return (
    <Link to="/" className={cn('inline-flex items-center gap-2 select-none', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        role="img"
        aria-hidden="true"
        className="drop-shadow-sm"
      >
        <defs>
          <radialGradient id={haloId} cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={bladeA} x1="0%" y1="15%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#7c2df5" />
            <stop offset="45%" stopColor="#5c35f7" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id={bladeB} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        <circle cx="64" cy="64" r="54" fill={`url(#${haloId})`} />

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g stroke={`url(#${bladeA})`} strokeWidth="10">
            <path d="M64 10c-7.5 0-14.7 2.7-20.4 7.6l7 7c3.7-3 8.3-4.6 13.1-4.6 11.5 0 20.8 9.3 20.8 20.8 0 4.8-1.6 9.4-4.6 13.1l7 7c4.9-5.7 7.6-12.9 7.6-20.4C94.5 23.7 80.8 10 64 10z" />
            <path d="M37.1 15.9c-6.5 3.7-11.3 9.8-13.2 17l9.3 2.4c1.4-5.2 4.7-9.6 9.3-12.3 9.9-5.7 22.6-2.3 28.3 7.6 2.6 4.5 3.3 9.8 2 14.9l9.3 2.4c2.4-8.9 1.2-18.4-3.6-26.4C71.6 6.4 53.4 5 37.1 15.9z" />
          </g>
          <g stroke={`url(#${bladeB})`} strokeWidth="10">
            <path d="M19.2 39.5c-1.9 7.2-1.1 14.8 2.1 21.4l8.7-4c-2.2-4.6-2.8-9.9-1.5-14.9 3.1-11.1 14.6-17.6 25.7-14.5 4.9 1.4 9.1 4.6 11.9 9l8.7-4c-4.7-8-12.3-14-21.4-16.6-12.7-3.6-25.9 2.8-33.1 15.6z" />
            <path d="M28.5 88.1c4.7 8.1 12.4 14.2 21.6 16.7l2.5-9.5c-5.3-1.4-9.9-4.8-12.8-9.4-6-9.9-2.8-22.9 7.1-28.9 4.4-2.6 9.7-3.3 14.9-2l2.5-9.5c-9-2.5-18.8-1-26.8 4.2-10.7 6.6-14.1 20.6-8.9 31.4z" />
          </g>
        </g>

        <circle cx="64" cy="64" r="8.5" fill="#f8fafc" />
        <circle cx="64" cy="64" r="5" fill="#0b1024" />
      </svg>

      {showName && (
        <div className="leading-tight">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-[#7c2df5] via-[#5c35f7] to-[#0ea5e9] text-transparent bg-clip-text">
              cuircle
            </span>
            <span className="text-lg font-black text-sky-500">-cart</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
            Local marketplace
          </div>
        </div>
      )}
    </Link>
  );
}
