import { Link } from 'react-router-dom';
import { MapPin, Star, Shield, ChevronRight } from 'lucide-react';
import { Seller, formatTimeAgo } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SellerCardProps {
  seller: Seller;
  variant?: 'compact' | 'full';
  showChevron?: boolean;
}

export function SellerCard({ seller, variant = 'compact', showChevron = true }: SellerCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/profile/${seller.id}`}
        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
      >
        <img
          src={seller.avatar}
          alt={seller.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-card"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate">{seller.name}</span>
            {seller.isVerified && (
              <Shield className="w-4 h-4 text-success flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-warning text-warning" />
              <span>{seller.rating}</span>
            </div>
            <span>•</span>
            <span>{seller.reviewCount} reviews</span>
          </div>
        </div>
        {showChevron && (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </Link>
    );
  }

  return (
    <Link
      to={`/profile/${seller.id}`}
      className="marketplace-card p-4"
    >
      <div className="flex items-start gap-4">
        <img
          src={seller.avatar}
          alt={seller.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-card"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-foreground">{seller.name}</h3>
            {seller.isVerified && (
              <span className="verified-badge">
                <Shield className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{seller.city}</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-semibold">{seller.rating}</span>
              <span className="text-muted-foreground">({seller.reviewCount})</span>
            </div>
            <div className="text-muted-foreground">
              {seller.listingsCount} listings
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Member since</p>
          <p className="font-medium text-sm mt-0.5">
            {seller.memberSince.toLocaleDateString('en-IN', {
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Response rate</p>
          <p className="font-medium text-sm mt-0.5">{seller.responseRate}%</p>
        </div>
      </div>
    </Link>
  );
}
