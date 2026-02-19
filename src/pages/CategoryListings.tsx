import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { BottomNav } from '@/components/layout/BottomNav';
import { EmptyState } from '@/components/marketplace/EmptyState';
import { categories, getListingsByCategory } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function CategoryListings() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { detectedCity } = useApp();

  const category = categories.find((c) => c.id === categoryId);
  const categoryListings = categoryId ? getListingsByCategory(categoryId) : [];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 safe-top">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{category.name}</h1>
            <p className="text-sm text-muted-foreground">
              {categoryListings.length} listings in {detectedCity}
            </p>
          </div>
        </div>
      </header>

      {/* Listings */}
      <section className="p-4">
        {categoryListings.length === 0 ? (
          <EmptyState type="listings" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} variant="grid" />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
}
