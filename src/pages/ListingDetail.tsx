import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  ShoppingCart,
  Flag,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SellerCard } from '@/components/marketplace/SellerCard';
import { RatingStars } from '@/components/marketplace/RatingStars';
import { listings, formatPrice, formatTimeAgo, reviews } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ListingDetail() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, cartItems, addToCart, removeFromCart } = useApp();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const listing = listings.find((l) => l.id === listingId);
  const relatedListings = listings
    .filter((item) => item.id !== listingId && item.category === listing?.category)
    .slice(0, 3);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Listing not found</p>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;

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
        description: 'Listing link has been copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Unable to copy link',
        description: 'Please copy the URL manually from the address bar.',
        variant: 'destructive',
      });
    }
  };

  const handleChat = () => {
    if (!isLoggedIn) {
      toast({
        title: 'Login required',
        description: 'Please login to chat with the seller.',
        variant: 'destructive',
      });
      return;
    }
    navigate(`/chat/${listing.seller.id}?listing=${listing.id}`);
  };

  const handleReport = () => {
    toast({
      title: 'Report submitted',
      description: 'Thank you for helping keep our marketplace safe.',
    });
  };

  const isInCart = cartItems.includes(listing.id);

  const handleAddToCart = () => {
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

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Image carousel */}
      <div className="relative">
        <div className="relative h-[52vh] min-h-[300px] max-h-[560px] bg-secondary overflow-hidden">
          <img
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            className="w-full h-full object-contain p-2 sm:p-3"
          />
        </div>

        {/* Navigation overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {listing.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="p-2 rounded-full bg-card/80 backdrop-blur-sm transition-transform hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="p-2 rounded-full bg-card/80 backdrop-blur-sm transition-transform hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between safe-top">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-card/80 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-card/80 backdrop-blur-sm transition-transform hover:scale-110"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full bg-card/80 backdrop-blur-sm transition-transform hover:scale-110"
            >
              <Heart
                className={cn(
                  'w-5 h-5',
                  isFavorite && 'fill-destructive text-destructive'
                )}
              />
            </button>
          </div>
        </div>

        {/* Image indicators */}
        {listing.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {listing.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentImageIndex
                    ? 'bg-primary w-4'
                    : 'bg-card/60'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:px-6 md:pb-8">
        <div className="mx-auto w-full max-w-7xl md:grid md:grid-cols-[minmax(0,1fr)_320px] md:gap-6">
          <div className="space-y-4">
            {/* Price & title */}
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(listing.price)}
                {listing.category === 'Property' && (
                  <span className="text-base font-normal text-muted-foreground">/month</span>
                )}
              </p>
              <h1 className="text-xl font-semibold text-foreground mt-1">
                {listing.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                <span className="category-pill text-xs py-1">{listing.category}</span>
                <span>{listing.area}</span>
                <span>|</span>
                <span>{formatTimeAgo(listing.postedAt)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                <Eye className="w-4 h-4" />
                <span>{listing.views} views</span>
              </div>
            </div>

            {/* Description */}
            <div className="marketplace-card p-4">
              <h2 className="font-semibold text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Seller card */}
            <div>
              <h2 className="font-semibold text-foreground mb-2">Seller</h2>
              <SellerCard seller={listing.seller} variant="full" />
            </div>

            {/* Reviews preview */}
            <div className="marketplace-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-foreground">Reviews</h2>
                <Link to={`/reviews/${listing.seller.id}`} className="text-sm text-primary">
                  See all
                </Link>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <RatingStars rating={listing.seller.rating} showValue />
                <span className="text-sm text-muted-foreground">
                  ({listing.seller.reviewCount} reviews)
                </span>
              </div>
              {reviews.slice(0, 2).map((review) => (
                <div key={review.id} className="flex gap-3 mb-3 last:mb-0">
                  <img
                    src={review.reviewer.avatar}
                    alt={review.reviewer.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{review.reviewer.name}</span>
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {review.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="hidden md:block">
            <div className="sticky top-6 space-y-4">
              <div className="marketplace-card p-4">
                <h2 className="font-semibold text-foreground mb-3">Product Details</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium text-right">{listing.category}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="font-medium text-right">{listing.area}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Posted</dt>
                    <dd className="font-medium text-right">{formatTimeAgo(listing.postedAt)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Views</dt>
                    <dd className="font-medium text-right">{listing.views}</dd>
                  </div>
                </dl>
              </div>

              {relatedListings.length > 0 && (
                <div className="marketplace-card p-4">
                  <h2 className="font-semibold text-foreground mb-3">Related Products</h2>
                  <div className="space-y-3">
                    {relatedListings.map((item) => (
                      <Link
                        key={item.id}
                        to={`/listing/${item.id}`}
                        className="flex gap-3 rounded-lg border border-border/60 p-2 hover:bg-muted/40 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-sm text-primary font-medium">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.area} | {formatTimeAgo(item.postedAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="marketplace-card p-4 space-y-3">
                {/* <Button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart ? 'Remove from Cart' : ''}
                </Button> */}
                <Button onClick={handleChat} className="w-full" size="lg" disabled={!isLoggedIn}>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with Seller
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={cn(
                        'w-4 h-4',
                        isFavorite && 'fill-destructive text-destructive'
                      )}
                    />
                  </Button>
                  <Button variant="outline" onClick={handleReport}>
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-bottom md:hidden">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="flex-shrink-0">
                <Flag className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report this listing?</DialogTitle>
                <DialogDescription>
                  If you believe this listing violates our guidelines, please let us know.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 pt-4">
                {['Spam or fake', 'Prohibited item', 'Wrong category', 'Other'].map((reason) => (
                  <Button
                    key={reason}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleReport}
                  >
                    {reason}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={handleAddToCart}
            className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isInCart ? 'Remove from Cart' : ''}
          </Button> */}
          <Button
            onClick={handleChat}
            className="flex-1 h-12"
            size="lg"
            disabled={!isLoggedIn}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat with Seller
          </Button>
        </div>
      </div>
    </div>
  );
}
