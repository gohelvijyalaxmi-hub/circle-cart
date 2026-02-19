import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { BottomNav } from '@/components/layout/BottomNav';
import { listings } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function Favorites() {
  const navigate = useNavigate();
  const { favoriteIds } = useApp();

  const favoriteListings = listings.filter(
    (listing) => favoriteIds.includes(listing.id) || listing.isFavorite
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Favorites</h1>
            <p className="text-xs text-muted-foreground">{favoriteListings.length} items saved</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {favoriteListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">No favorites yet</p>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Tap the heart icon on listings to save them here
            </p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Browse Listings
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {favoriteListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} variant="grid" />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
