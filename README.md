# City Marketplace - Frontend Prototype

A modern, mobile-first, hyper-local city-based marketplace web application UI, similar to Facebook Marketplace. This is a **frontend-only prototype** with mock data and no backend integration.

## 🚀 Live Demo

Visit the preview: (demo preview URL removed for rebranding)

## 📱 Features

### Core Functionality
- **City-locked marketplace**: Users can only see listings from their current city
- **Location-based access**: City auto-detected via browser geolocation (mocked)
- **Dark/Light theme**: Toggle between themes with system preference detection

### User Flows
- **Guest Mode**: Browse listings with limited functionality
- **Logged-in Mode**: Full access to post listings, chat, and rate sellers

### Screens & Pages
| Page | Route | Description |
|------|-------|-------------|
| Location Permission | `/location` | Request location access (mocked) |
| Home / Listings Feed | `/` | Browse all listings with search & filters |
| Categories | `/categories` | Browse by category |
| Category Listings | `/category/:id` | Listings filtered by category |
| Listing Detail | `/listing/:id` | Full listing view with seller info |
| Post Listing | `/post` | Create new listing form |
| Messages | `/messages` | Chat conversations list |
| Chat | `/chat/:id` | Individual chat with seller |
| Profile | `/profile` | User profile with stats & listings |
| Edit Profile | `/edit-profile` | Update profile information |
| Settings | `/settings` | App preferences & account settings |
| Notifications | `/notifications` | Activity notifications |
| Favorites | `/favorites` | Saved/liked listings |
| My Listings | `/my-listings` | User's own listings |
| Verification | `/verification` | ID verification flow (UI only) |
| Reviews | `/reviews/:id` | Seller reviews |

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Context API

## 📦 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx       # Mobile navigation bar
│   ├── marketplace/
│   │   ├── CategoryCard.tsx    # Category display card
│   │   ├── ChatBubble.tsx      # Chat message bubble
│   │   ├── EmptyState.tsx      # Empty state component
│   │   ├── ListingCard.tsx     # Listing grid/list card
│   │   ├── RatingStars.tsx     # Star rating display
│   │   ├── SellerCard.tsx      # Seller info card
│   │   └── Skeleton.tsx        # Loading skeletons
│   └── ui/                     # shadcn/ui components
├── context/
│   └── AppContext.tsx          # Global app state
├── data/
│   └── mockData.ts             # All mock data & types
├── hooks/
│   ├── useTheme.tsx            # Theme management hook
│   ├── use-mobile.tsx          # Mobile detection hook
│   └── use-toast.ts            # Toast notifications
├── pages/                      # All page components
├── lib/
│   └── utils.ts                # Utility functions
├── App.tsx                     # Root component with routing
├── main.tsx                    # App entry point
└── index.css                   # Global styles & design tokens
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Start development server
npm run dev
# or
yarn dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# Preview production build
npm run preview
```

## 🎨 Design System

### Color Tokens (HSL)
Located in `src/index.css`:

```css
/* Dark Theme (Default) */
--background: 222 47% 6%;      /* Deep slate background */
--foreground: 210 40% 98%;     /* Light text */
--primary: 217 91% 60%;        /* Vibrant blue */
--accent: 24 95% 53%;          /* Orange accent */
--success: 142 71% 45%;        /* Green for verified */
--warning: 38 92% 50%;         /* Amber for ratings */
--destructive: 0 72% 51%;      /* Red for errors */
```

### Custom CSS Classes
- `.marketplace-card` - Card with shadow and hover effects
- `.price-tag` - Price display styling
- `.verified-badge` - Verified seller badge
- `.category-pill` - Category tag styling
- `.chat-bubble-sent/.chat-bubble-received` - Chat bubbles
- `.nav-active` - Active navigation indicator

## 🔌 Backend Integration Guide

This frontend is designed to be backend-agnostic. Here's how to connect it to a real backend:

### Option 1: Supabase (Recommended)

1. **Create Supabase Project**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Initialize Supabase
   supabase init
   ```

2. **Database Schema**
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     name TEXT NOT NULL,
     avatar_url TEXT,
     city TEXT NOT NULL,
     is_verified BOOLEAN DEFAULT false,
     rating DECIMAL(2,1) DEFAULT 0,
     review_count INTEGER DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Listings table
   CREATE TABLE listings (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     description TEXT,
     price INTEGER NOT NULL,
     category TEXT NOT NULL,
     city TEXT NOT NULL,
     area TEXT,
     images TEXT[] DEFAULT '{}',
     seller_id UUID REFERENCES users(id),
     is_sold BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Messages table
   CREATE TABLE messages (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     listing_id UUID REFERENCES listings(id),
     sender_id UUID REFERENCES users(id),
     receiver_id UUID REFERENCES users(id),
     content TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Reviews table
   CREATE TABLE reviews (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     reviewer_id UUID REFERENCES users(id),
     seller_id UUID REFERENCES users(id),
     rating INTEGER CHECK (rating >= 1 AND rating <= 5),
     text TEXT,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Favorites table
   CREATE TABLE favorites (
     user_id UUID REFERENCES users(id),
     listing_id UUID REFERENCES listings(id),
     PRIMARY KEY (user_id, listing_id)
   );
   ```

3. **Enable Row Level Security (RLS)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
   ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

   -- Listings: Anyone can read, only owner can modify
   CREATE POLICY "Listings are viewable by everyone" ON listings
     FOR SELECT USING (true);
   
   CREATE POLICY "Users can insert own listings" ON listings
     FOR INSERT WITH CHECK (auth.uid() = seller_id);
   
   CREATE POLICY "Users can update own listings" ON listings
     FOR UPDATE USING (auth.uid() = seller_id);
   ```

4. **Connect Frontend**
   ```typescript
   // src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

5. **Replace Mock Data with API Calls**
   ```typescript
   // Example: Fetch listings
   import { supabase } from '@/lib/supabase';

   export async function getListings(city: string) {
     const { data, error } = await supabase
       .from('listings')
       .select(`
         *,
         seller:users(*)
       `)
       .eq('city', city)
       .order('created_at', { ascending: false });
     
     if (error) throw error;
     return data;
   }
   ```

### Option 2: Custom REST API

1. **API Endpoints to Implement**
   ```
   Authentication:
   POST   /api/auth/register
   POST   /api/auth/login
   POST   /api/auth/logout
   GET    /api/auth/me

   Users:
   GET    /api/users/:id
   PUT    /api/users/:id
   POST   /api/users/:id/verify

   Listings:
   GET    /api/listings?city=:city&category=:category
   GET    /api/listings/:id
   POST   /api/listings
   PUT    /api/listings/:id
   DELETE /api/listings/:id

   Messages:
   GET    /api/conversations
   GET    /api/conversations/:id/messages
   POST   /api/messages

   Reviews:
   GET    /api/users/:id/reviews
   POST   /api/reviews

   Favorites:
   GET    /api/favorites
   POST   /api/favorites/:listingId
   DELETE /api/favorites/:listingId
   ```

2. **Create API Client**
   ```typescript
   // src/lib/api.ts
   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

   async function fetchApi<T>(
     endpoint: string,
     options?: RequestInit
   ): Promise<T> {
     const token = localStorage.getItem('auth_token');
     
     const response = await fetch(`${API_BASE}${endpoint}`, {
       ...options,
       headers: {
         'Content-Type': 'application/json',
         ...(token && { Authorization: `Bearer ${token}` }),
         ...options?.headers,
       },
     });
     
     if (!response.ok) {
       throw new Error(`API Error: ${response.statusText}`);
     }
     
     return response.json();
   }

   export const api = {
     listings: {
       getAll: (city: string) => fetchApi<Listing[]>(`/api/listings?city=${city}`),
       getById: (id: string) => fetchApi<Listing>(`/api/listings/${id}`),
       create: (data: CreateListingDto) => fetchApi<Listing>('/api/listings', {
         method: 'POST',
         body: JSON.stringify(data),
       }),
     },
     // ... other endpoints
   };
   ```

### Option 3: Firebase

1. **Initialize Firebase**
   ```typescript
   // src/lib/firebase.ts
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   import { getAuth } from 'firebase/auth';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   export const storage = getStorage(app);
   ```

2. **Firestore Collections**
   - `users` - User profiles
   - `listings` - Marketplace listings
   - `messages` - Chat messages
   - `reviews` - Seller reviews

### File Upload Integration

For image uploads, integrate with:
- **Supabase Storage**: `supabase.storage.from('listings').upload()`
- **AWS S3**: Use presigned URLs
- **Cloudinary**: Direct upload API
- **Firebase Storage**: `uploadBytes()` method

### Geolocation Integration

Replace mock city detection with real geolocation:

```typescript
// src/hooks/useGeolocation.ts
export function useGeolocation() {
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get city name
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
          );
          const data = await response.json();
          const cityName = data.results[0]?.components?.city;
          
          setCity(cityName);
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
        }
      );
    }
  }, []);

  return { city, loading };
}
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📝 Environment Variables

Create a `.env` file in the project root:

```env
# Supabase (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Custom API (if using)
VITE_API_URL=http://localhost:3000

# Firebase (if using)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Geolocation API
VITE_GEOCODING_API_KEY=your_geocoding_api_key
```

## 🔄 State Management Migration

To migrate from Context to a more robust solution:

### React Query (Recommended for API data)
```typescript
// Already installed! Use for server state
import { useQuery, useMutation } from '@tanstack/react-query';

function useListings(city: string) {
  return useQuery({
    queryKey: ['listings', city],
    queryFn: () => api.listings.getAll(city),
  });
}
```

### Zustand (For client state)
```bash
npm install zustand
```

```typescript
// src/stores/appStore.ts
import { create } from 'zustand';

interface AppState {
  isLoggedIn: boolean;
  user: User | null;
  city: string;
  setUser: (user: User | null) => void;
  setCity: (city: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  user: null,
  city: 'Ahmedabad',
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  setCity: (city) => set({ city }),
}));
```

## 📄 License

MIT License - feel free to use this template for your own projects!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using the My Mart frontend toolkit
