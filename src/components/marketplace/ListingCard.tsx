import { Heart, MapPin, Share2, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Listing, formatPrice, formatTimeAgo } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

interface ListingCardProps {
  listing: Listing;
  variant?: 'grid' | 'list';
  enableCart?: boolean;
}

export function ListingCard({ listing, variant = 'grid', enableCart = true }: ListingCardProps) {
  const { favoriteIds, toggleFavorite } = useApp();
  const isFavorite = favoriteIds.includes(listing.id) || listing.isFavorite;
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, cartItems, addToCart, removeFromCart } = useApp();
  const isInCart = cartItems.includes(listing.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/listing/${listing.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `${listing.title} - ${formatPrice(listing.price)}`,
          url,
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Product link has been copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Unable to share',
        description: 'Please copy the URL manually from the address bar.',
        variant: 'destructive',
      });
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast({
        title: 'Login required',
        description: 'Please login to add products to cart.',
        variant: 'destructive',
      });
      return;
    }

    if (isInCart) {
      removeFromCart(listing.id);
      toast({
        title: 'Removed from cart',
        description: 'Product has been removed from your cart.',
      });
      return;
    }

    addToCart(listing.id);
    toast({
      title: 'Added to cart',
      description: 'Product has been added to your cart.',
    });
  };

  const cartTextButtonClass =
    "mt-3 h-10 w-full text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors";

  if (variant === 'list') {
    return (
      <Link
        to={`/listing/${listing.id}`}
        className="listing-card-compact flex gap-3 p-2 animate-fade-in"
      >
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
          <img
            src={listing.image}
            alt={listing.title}
            className={cn(
              "w-full h-full object-cover transition-opacity",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          <button
            onClick={handleShareClick}
            className="absolute top-1.5 left-1.5 p-1 rounded-full bg-card/90 backdrop-blur-sm shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {enableCart && (
            <button
              onClick={handleAddToCartClick}
              className={cn(
                "absolute bottom-1.5 left-1.5 p-1 rounded-full bg-primary text-primary-foreground backdrop-blur-sm shadow-sm"
              )}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-card/90 backdrop-blur-sm shadow-sm"
          >
            <Heart
              className={cn(
                "w-3.5 h-3.5 transition-colors",
                isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
              )}
            />
          </button>
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <p className="text-base font-bold text-foreground">
            {formatPrice(listing.price)}
          </p>
          <h3 className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1.5">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{listing.area}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-warning text-warning" />
              <span className="text-xs font-medium">{listing.seller.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(listing.postedAt)}
            </span>
          </div>
          {enableCart && (
            <Button
              size="sm"
              className={cartTextButtonClass}
              onClick={handleAddToCartClick}
            >
              {isInCart ? 'Remove from Cart' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="listing-card-compact block animate-fade-in group"
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden rounded-t-lg">
        {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
        <img
          src={listing.image}
          alt={listing.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        <button
          onClick={handleShareClick}
          className="absolute top-2 left-2 p-1.5 rounded-full bg-card/90 backdrop-blur-sm shadow-sm transition-transform hover:scale-110"
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </button>
        {enableCart && (
          <button
            onClick={handleAddToCartClick}
            className={cn(
              "absolute bottom-2 left-2 p-1.5 rounded-full bg-primary text-primary-foreground backdrop-blur-sm shadow-sm transition-transform hover:scale-110"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-card/90 backdrop-blur-sm shadow-sm transition-transform hover:scale-110"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
            )}
          />
        </button>
        {listing.seller.isVerified && (
          <div className="absolute bottom-2 left-2 verified-badge">
            <span>Verified</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-base font-bold text-foreground">{formatPrice(listing.price)}</p>
        <h3 className="text-sm text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[80px]">{listing.area}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-warning text-warning" />
            <span className="text-xs font-medium">{listing.seller.rating}</span>
          </div>
        </div>
        {enableCart && (
          <Button
            size="sm"
            className={cartTextButtonClass}
            onClick={handleAddToCartClick}
          >
            {isInCart ? 'Remove from Cart' : 'Add to Cart'}
          </Button>
        )}
      </div>
    </Link>
  );
}
