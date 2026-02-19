import { ArrowLeft, Plus, Package, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { BottomNav } from '@/components/layout/BottomNav';
import { listings, currentUser, deleteUserListing } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function MyListings() {
  const navigate = useNavigate();
  const { user } = useApp();
  const activeUser = user ?? currentUser;
  const { toast } = useToast();
  const [version, setVersion] = useState(0); // bump to trigger rerender after deletion
  
  // Get current user's listings
  const userListings = listings.filter((l) => l.seller.id === activeUser.id);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Delete this listing? Buyers will no longer see it.');
    if (!confirmed) return;
    deleteUserListing(id);
    setVersion((v) => v + 1);
    toast({
      title: 'Listing removed',
      description: 'Your product is no longer visible to buyers.',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">My Listings</h1>
              <p className="text-xs text-muted-foreground">{userListings.length} active</p>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link to="/post">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {userListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">No listings yet</p>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Start selling by posting your first listing
            </p>
            <Button className="mt-4" asChild>
              <Link to="/post">Post a Listing</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {userListings.map((listing) => (
              <div key={listing.id} className="space-y-2">
                <ListingCard listing={listing} variant="grid" />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(listing.id)}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
