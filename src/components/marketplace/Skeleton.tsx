import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  variant?: 'grid' | 'list';
}

export function SkeletonCard({ variant = 'grid' }: SkeletonCardProps) {
  if (variant === 'list') {
    return (
      <div className="marketplace-card flex gap-3 p-3">
        <div className="w-28 h-28 rounded-lg skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          <div className="h-5 w-1/3 rounded skeleton-shimmer" />
          <div className="h-3 w-1/2 rounded skeleton-shimmer" />
          <div className="h-3 w-1/4 rounded skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-card">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-5 w-2/3 rounded skeleton-shimmer" />
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded skeleton-shimmer" />
        <div className="h-3 w-1/3 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full skeleton-shimmer" />
        <div className="space-y-2">
          <div className="h-5 w-32 rounded skeleton-shimmer" />
          <div className="h-4 w-24 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-16 rounded-xl skeleton-shimmer" />
        <div className="h-16 rounded-xl skeleton-shimmer" />
        <div className="h-16 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}
