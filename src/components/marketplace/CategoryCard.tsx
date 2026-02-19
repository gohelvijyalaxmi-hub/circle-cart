import { Link } from 'react-router-dom';
import {
  Smartphone,
  Car,
  Home,
  Wrench,
  Sofa,
  Briefcase,
  Package,
  BookOpen,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { Category } from '@/data/mockData';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Car,
  Home,
  Wrench,
  Sofa,
  Briefcase,
  Package,
  BookOpen,
  Sparkles,
};

interface CategoryCardProps {
  category: Category;
  variant?: 'card' | 'pill';
}

export function CategoryCard({ category, variant = 'card' }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Package;

  if (variant === 'pill') {
    return (
      <Link
        to={`/category/${category.id}`}
        className="category-pill whitespace-nowrap flex-shrink-0"
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{category.name}</span>
      </Link>
    );
  }

  return (
    <Link
      to={`/category/${category.id}`}
      className={cn(
        'listing-card-compact flex flex-col items-center justify-center p-4 text-center',
        'hover:border-primary/30 group transition-all'
      )}
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary group-hover:scale-105 transition-all">
        <Icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
      <span className="font-medium text-sm text-foreground">{category.name}</span>
      <span className="text-[10px] text-muted-foreground mt-0.5">
        {category.count} ads
      </span>
    </Link>
  );
}
