import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  showName?: boolean;
  className?: string;
  size?: number;
}

// Simple inline logo for the marketplace brand "My Mart"
export function Logo({ showName = true, className, size = 36 }: LogoProps) {
  const stroke = '#2563eb'; // blue tone
  const fill = 'url(#mymart-gradient)';

  return (
    <Link to="/" className={cn('inline-flex items-center gap-2 select-none', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
        role="img"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="mymart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        {/* Pin/Shop marker */}
        <path
          d="M32 6c-9.4 0-17 7.3-17 16.3 0 13.5 14.1 28.8 16.1 31 0.5 0.5 1.3 0.5 1.8 0 2-2.2 16.1-17.5 16.1-31C49 13.3 41.4 6 32 6z"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
        />
        {/* Shop awning */}
        <path
          d="M18 24h28v6.5c0 2.5-2 4.5-4.5 4.5H22.5C20 35 18 33 18 30.5V24z"
          fill="#fff"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Window/door */}
        <rect x="26" y="28" width="12" height="12" rx="2" fill="#e0e7ff" />
        <rect x="30" y="28" width="2" height="12" fill="#2563eb" />
      </svg>
      {showName && (
        <div className="leading-tight">
          <div className="text-base font-black text-foreground">My Mart</div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Local Marketplace
          </div>
        </div>
      )}
    </Link>
  );
}
