import { useState } from 'react';
import { Search, SlidersHorizontal, Grid2X2, LayoutList, MapPin, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CategoryCard } from '@/components/marketplace/CategoryCard';
import { BottomNav } from '@/components/layout/BottomNav';
import { ThemeToggleButton } from '@/components/layout/ThemeToggleButton';
import { EmptyState } from '@/components/marketplace/EmptyState';
import { listings, categories, searchListings } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
  const navigate = useNavigate();
  const { detectedCity, cartItems } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredListings = searchQuery
    ? searchListings(searchQuery)
    : listings.filter((listing) => {
        if (
          selectedCategory !== 'all' &&
          !listing.category.toLowerCase().includes(selectedCategory)
        ) {
          return false;
        }
        if (listing.price < priceRange[0] || listing.price > priceRange[1]) {
          return false;
        }
        return true;
      });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.postedAt.getTime() - a.postedAt.getTime();
    }
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Logo showName className="shrink-0" size={36} />
              <div className="flex items-center gap-1 text-primary text-xs font-medium">
                <MapPin className="w-3 h-3" />
                <span>{detectedCity}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggleButton />
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/notifications')}
                aria-label="Open notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search in ${detectedCity}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 input-marketplace"
              />
            </div>
            <Button
              variant="secondary"
              className="h-10 px-3 text-xs sm:text-sm"
              onClick={() => navigate('/my-orders')}
            >
              My Orders ({cartItems.length})
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto rounded-t-2xl max-h-[70vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-5 py-4">
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Price: INR {priceRange[0].toLocaleString()} - INR {priceRange[1].toLocaleString()}
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200000}
                      step={1000}
                      className="mt-3"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Categories scroll */}
      <section className="px-4 py-3 border-b border-border/50">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} variant="pill" />
          ))}
        </div>
      </section>

      {/* View toggle & count */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30">
        <p className="text-xs text-muted-foreground font-medium">
          {sortedListings.length} listings
        </p>
        <div className="flex gap-0.5 bg-card border border-border rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Listings */}
      <section className="p-4">
        {sortedListings.length === 0 ? (
          <EmptyState type={searchQuery ? 'search' : 'listings'} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {sortedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} variant="grid" enableCart />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} variant="list" enableCart />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
}
