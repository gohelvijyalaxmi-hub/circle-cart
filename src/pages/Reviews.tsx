import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RatingStars } from '@/components/marketplace/RatingStars';
import { EmptyState } from '@/components/marketplace/EmptyState';
import { BottomNav } from '@/components/layout/BottomNav';
import { sellers, reviews, currentUser } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function Reviews() {
  const { sellerId } = useParams();
  const { user } = useApp();
  const activeUser = user ?? currentUser;

  const seller =
    sellerId === activeUser.id
      ? activeUser
      : sellers.find((s) => s.id === sellerId);

  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Seller not found</p>
      </div>
    );
  }

  // Calculate rating distribution (mock)
  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 7 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 safe-top">
        <div className="flex items-center gap-3">
          <Link
            to={sellerId === activeUser.id ? '/profile' : `/listing/${sellerId}`}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground">Reviews</h1>
            <p className="text-sm text-muted-foreground">{seller.name}</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Rating summary */}
        <div className="marketplace-card p-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{seller.rating}</p>
              <RatingStars rating={seller.rating} size="sm" />
              <p className="text-xs text-muted-foreground mt-1">
                {seller.reviewCount} reviews
              </p>
            </div>
            <div className="flex-1 space-y-1">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">
                    {item.stars}
                  </span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">All Reviews</h2>
          {reviews.length === 0 ? (
            <EmptyState type="reviews" />
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="marketplace-card p-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <img
                      src={review.reviewer.avatar}
                      alt={review.reviewer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {review.reviewer.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {review.date.toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <RatingStars rating={review.rating} size="sm" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
