import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { BottomNav } from '@/components/layout/BottomNav';
import { listings } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function MyOrders() {
  const navigate = useNavigate();
  const { cartItems } = useApp();
  const orderedItems = listings.filter((listing) => cartItems.includes(listing.id));
  const subtotal = orderedItems.reduce((sum, item) => sum + item.price, 0);
  const discountRate = orderedItems.length >= 3 ? 0.1 : orderedItems.length >= 2 ? 0.05 : 0;
  const discount = Math.floor(subtotal * discountRate);
  const delivery = orderedItems.length > 0 ? 79 : 0; // flat delivery charge
  const total = subtotal - discount + delivery;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">My Orders</h1>
            <p className="text-xs text-muted-foreground">{orderedItems.length} items</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        {orderedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Add products from home to see them here
            </p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {orderedItems.map((listing) => (
                <ListingCard key={listing.id} listing={listing} variant="list" enableCart />
              ))}
            </div>

            <div className="marketplace-card p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Items</span>
                <span className="text-sm font-semibold text-foreground">{orderedItems.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-semibold text-foreground">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Discount {discountRate > 0 ? `(${Math.round(discountRate * 100)}%)` : ''}
                </span>
                <span className="text-sm font-semibold text-destructive">
                  -₹{discount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery charges</span>
                <span className="text-sm font-semibold text-foreground">
                  ₹{delivery.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-base font-bold text-foreground">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-applied: 5% off for 2 items, 10% off for 3+ items. Delivery is flat ₹79.
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
