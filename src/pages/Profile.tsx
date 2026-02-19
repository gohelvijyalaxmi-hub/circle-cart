import { Link } from 'react-router-dom';
import {
  Settings,
  Shield,
  ChevronRight,
  MapPin,
  Star,
  Package,
  LogOut,
  Bell,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RatingStars } from '@/components/marketplace/RatingStars';
import { categories, currentUser, listings, mockChats, reviews, sellers } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { isLoggedIn, setIsLoggedIn, detectedCity, user, isHost } = useApp();
  const { toast } = useToast();
  const activeUser = user ?? currentUser;

  const userListings = listings.filter((l) => l.seller.id === activeUser.id).slice(0, 4);
  const favoriteCount = listings.filter((l) => l.isFavorite).length;
  const totalUsers = sellers.length + 1;
  const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0);
  const totalMessages = mockChats.reduce((sum, chat) => sum + chat.messages.length, 0);
  const topCategories = categories
    .map((category) => ({
      name: category.name,
      count: listings.filter(
        (listing) => listing.category.toLowerCase() === category.id.toLowerCase()
      ).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 safe-top">
          <h1 className="text-lg font-bold text-foreground">Profile</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Join the Marketplace</h2>
          <p className="text-muted-foreground text-center mb-6">
            Login to post listings, chat with sellers, and more.
          </p>
          <Button onClick={() => setIsLoggedIn(true)} size="lg">
            Login / Sign Up
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-top">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Profile</h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/notifications">
                <Bell className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile card */}
        <div className="marketplace-card p-4">
          <div className="flex items-start gap-4">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-secondary"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{activeUser.name}</h2>
                {activeUser.isVerified && (
                  <span className="verified-badge">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{detectedCity}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Member since{' '}
                {activeUser.memberSince.toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="font-bold text-lg">{activeUser.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="text-center">
              <span className="font-bold text-lg">{activeUser.reviewCount}</span>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div className="text-center">
              <span className="font-bold text-lg">{activeUser.listingsCount}</span>
              <p className="text-xs text-muted-foreground">Listings</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/favorites"
            className="marketplace-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Favorites</p>
              <p className="text-xs text-muted-foreground">{favoriteCount} saved</p>
            </div>
          </Link>
          <Link
            to="/notifications"
            className="marketplace-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Notifications</p>
              <p className="text-xs text-muted-foreground">2 new</p>
            </div>
          </Link>
        </div>

        {isHost && (
          <>
            <div className="marketplace-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Project Analytics</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  Host View
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="text-xl font-bold text-foreground">{totalUsers}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Total Listings</p>
                  <p className="text-xl font-bold text-foreground">{listings.length}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Total Views</p>
                  <p className="text-xl font-bold text-foreground">{totalViews}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Messages</p>
                  <p className="text-xl font-bold text-foreground">{totalMessages}</p>
                </div>
              </div>
            </div>

            <div className="marketplace-card p-4">
              <h3 className="font-semibold text-foreground mb-3">Top Categories</h3>
              <div className="space-y-3">
                {topCategories.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-muted-foreground">{item.count} listings</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(item.count / listings.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Verification status */}
        <Link
          to="/verification"
          className="marketplace-card p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">Verification</h3>
            <p className="text-xs text-success">Verified seller</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>

        {/* My listings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">My Listings</h3>
            <Link to="/my-listings" className="text-sm text-primary font-medium">
              See all
            </Link>
          </div>
          {userListings.length === 0 ? (
            <div className="marketplace-card p-6 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No listings yet</p>
              <Button asChild className="mt-3">
                <Link to="/post">Post your first listing</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {userListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} variant="grid" />
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Reviews</h3>
            <Link to={`/reviews/${activeUser.id}`} className="text-sm text-primary">
              See all
            </Link>
          </div>
          <div className="marketplace-card p-4 space-y-4">
            <div className="flex items-center gap-2">
              <RatingStars rating={activeUser.rating} showValue />
              <span className="text-sm text-muted-foreground">
                ({activeUser.reviewCount} reviews)
              </span>
            </div>
            {reviews.slice(0, 2).map((review) => (
              <div key={review.id} className="flex gap-3">
                <img
                  src={review.reviewer.avatar}
                  alt={review.reviewer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{review.reviewer.name}</span>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
