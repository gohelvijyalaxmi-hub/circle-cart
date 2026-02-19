import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { CategoryCard } from '@/components/marketplace/CategoryCard';
import { BottomNav } from '@/components/layout/BottomNav';
import { categories } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function Categories() {
  const { detectedCity } = useApp();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 safe-top">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground">Categories</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{detectedCity}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Categories grid */}
      <section className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} variant="card" />
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
