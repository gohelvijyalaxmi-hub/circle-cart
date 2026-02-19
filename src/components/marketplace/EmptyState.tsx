import { Package, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'listings' | 'search' | 'messages' | 'reviews';
  message?: string;
}

const states = {
  listings: {
    icon: Package,
    title: 'No listings yet',
    description: 'Be the first to post a listing in your area!',
    action: { label: 'Post a Listing', path: '/post' },
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters',
    action: null,
  },
  messages: {
    icon: ShoppingBag,
    title: 'No messages yet',
    description: 'Start a conversation by messaging a seller',
    action: { label: 'Browse Listings', path: '/' },
  },
  reviews: {
    icon: Package,
    title: 'No reviews yet',
    description: 'Reviews will appear here after transactions',
    action: null,
  },
};

export function EmptyState({ type, message }: EmptyStateProps) {
  const state = states[type];
  const Icon = state.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg text-foreground">{state.title}</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-xs">
        {message || state.description}
      </p>
      {state.action && (
        <Button asChild className="mt-4">
          <Link to={state.action.path}>{state.action.label}</Link>
        </Button>
      )}
    </div>
  );
}
