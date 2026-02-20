// Mock data for the city marketplace

export interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  area: string;
  city: string;
  postedAt: Date;
  seller: Seller;
  views: number;
  isFavorite: boolean;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  city: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  memberSince: Date;
  responseRate: number;
  listingsCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Chat {
  id: string;
  listing: Listing;
  otherUser: Seller;
  messages: Message[];
  lastMessageAt: Date;
}

export interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
  };
  rating: number;
  text: string;
  date: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Current user (mocked as logged in)
export const currentUser: Seller = {
  id: 'user-1',
  name: 'coplspury',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  city: 'Ahmedabad',
  rating: 4.8,
  reviewCount: 24,
  isVerified: true,
  memberSince: new Date('2023-06-15'),
  responseRate: 95,
  listingsCount: 12,
};

// Mock sellers
export const sellers: Seller[] = [
  {
    id: 'seller-1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    city: 'Ahmedabad',
    rating: 4.9,
    reviewCount: 156,
    isVerified: true,
    memberSince: new Date('2022-03-10'),
    responseRate: 98,
    listingsCount: 45,
  },
  {
    id: 'seller-2',
    name: 'Amit Kumar',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    city: 'Ahmedabad',
    rating: 4.5,
    reviewCount: 89,
    isVerified: true,
    memberSince: new Date('2023-01-20'),
    responseRate: 92,
    listingsCount: 28,
  },
  {
    id: 'seller-3',
    name: 'Neha Gupta',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    city: 'Ahmedabad',
    rating: 4.7,
    reviewCount: 67,
    isVerified: false,
    memberSince: new Date('2023-08-05'),
    responseRate: 88,
    listingsCount: 15,
  },
  {
    id: 'seller-4',
    name: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    city: 'Ahmedabad',
    rating: 4.2,
    reviewCount: 34,
    isVerified: true,
    memberSince: new Date('2024-02-12'),
    responseRate: 85,
  listingsCount: 8,
},
];

// --- Local persistence for user-added listings ---
const USER_LISTINGS_KEY = 'userListings';

const reviveListing = (item: any): Listing => ({
  ...item,
  postedAt: new Date(item.postedAt),
  seller: {
    ...item.seller,
    memberSince: new Date(item.seller?.memberSince ?? Date.now()),
  },
});

const loadUserListings = (): Listing[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_LISTINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(reviveListing);
  } catch (err) {
    console.warn('Failed to load user listings', err);
    return [];
  }
};

const persistUserListings = (items: Listing[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_LISTINGS_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save user listings', err);
  }
};

// Base mock listings
export let listings: Listing[] = [
  {
    id: 'listing-1',
    title: 'iPhone 14 Pro Max - 256GB Deep Purple',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
    ],
    category: 'Electronics',
    description: 'Brand new iPhone 14 Pro Max in Deep Purple. 256GB storage, still under warranty. Original box and accessories included. No scratches, used with case since day 1.',
    area: 'Satellite',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-15'),
    seller: sellers[0],
    views: 234,
    isFavorite: false,
  },
  {
    id: 'listing-2',
    title: 'Royal Enfield Classic 350 - 2023 Model',
    price: 175000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=800&fit=crop',
    ],
    category: 'Vehicles',
    description: 'Royal Enfield Classic 350, 2023 model, only 5000 km driven. First owner, all service records available. Matte black color, excellent condition.',
    area: 'Navrangpura',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-14'),
    seller: sellers[1],
    views: 567,
    isFavorite: false,
  },
  {
    id: 'listing-3',
    title: '2BHK Apartment for Rent - SG Highway',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop',
    ],
    category: 'Property',
    description: 'Spacious 2BHK apartment for rent on SG Highway. Fully furnished with modular kitchen, AC in both rooms. Society with gym, swimming pool, and 24/7 security.',
    area: 'SG Highway',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-13'),
    seller: sellers[2],
    views: 1023,
    isFavorite: false,
  },
  {
    id: 'listing-4',
    title: 'L-Shaped Sofa Set - Premium Fabric',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
    ],
    category: 'Furniture',
    description: '7-seater L-shaped sofa set in premium grey fabric. 2 years old, excellent condition. Includes cushions and center table. Moving out sale.',
    area: 'Bodakdev',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-12'),
    seller: sellers[3],
    views: 189,
    isFavorite: false,
  },
  {
    id: 'listing-5',
    title: 'MacBook Pro M2 - 14 inch',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
    ],
    category: 'Electronics',
    description: 'MacBook Pro 14-inch with M2 Pro chip. 16GB RAM, 512GB SSD. Purchased 6 months ago, barely used. Includes original charger and box.',
    area: 'Prahlad Nagar',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-11'),
    seller: sellers[0],
    views: 456,
    isFavorite: false,
  },
  {
    id: 'listing-6',
    title: 'Honda City ZX - 2022 Petrol',
    price: 1150000,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=800&fit=crop',
    ],
    category: 'Vehicles',
    description: 'Honda City ZX variant, 2022 model. Petrol, automatic transmission. Single owner, 15000 km driven. Top-end with sunroof, leather seats.',
    area: 'Vastrapur',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-10'),
    seller: sellers[1],
    views: 890,
    isFavorite: false,
  },
  {
    id: 'listing-7',
    title: 'Home Cleaning Services',
    price: 500,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop',
    ],
    category: 'Services',
    description: 'Professional home cleaning services. Deep cleaning, regular maintenance, move-in/move-out cleaning. Trained staff, eco-friendly products.',
    area: 'Thaltej',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-09'),
    seller: sellers[2],
    views: 234,
    isFavorite: false,
  },
  {
    id: 'listing-8',
    title: 'Software Developer Position - React/Node',
    price: 0,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop',
    ],
    category: 'Jobs',
    description: 'Looking for experienced React/Node.js developers. 3-5 years experience required. Remote-friendly, competitive salary. Apply with portfolio.',
    area: 'Ashram Road',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-08'),
    seller: sellers[3],
    views: 1567,
    isFavorite: false,
  },
  {
    id: 'listing-9',
    title: 'Samsung 55" QLED Smart TV',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
    ],
    category: 'Electronics',
    description: 'Samsung 55-inch QLED 4K Smart TV. Crystal clear picture, excellent sound. 1 year old, under warranty. Wall mount included.',
    area: 'Chandkheda',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-07'),
    seller: sellers[0],
    views: 345,
    isFavorite: false,
  },
  {
    id: 'listing-10',
    title: 'Study Table with Chair',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop',
    ],
    category: 'Furniture',
    description: 'Wooden study table with ergonomic chair. Perfect for home office or students. Good condition, minor wear.',
    area: 'Memnagar',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-06'),
    seller: sellers[1],
    views: 123,
    isFavorite: false,
  },
  {
    id: 'listing-11',
    title: 'Boat Airdopes 141 - Wireless Earbuds',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=800&fit=crop',
    ],
    category: 'Electronics',
    description: 'Boat Airdopes 141 in excellent condition. Battery backup around 5 hours on single charge. Charging cable and box included.',
    area: 'Naranpura',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-05'),
    seller: sellers[0],
    views: 198,
    isFavorite: false,
  },
  {
    id: 'listing-12',
    title: 'TVS Jupiter 125 - 2022',
    price: 72000,
    image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=800&fit=crop',
    ],
    category: 'Vehicles',
    description: 'TVS Jupiter 125 scooter, single owner, good mileage and well-maintained. Insurance valid till next year.',
    area: 'Maninagar',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-04'),
    seller: sellers[1],
    views: 276,
    isFavorite: false,
  },
  {
    id: 'listing-13',
    title: '1RK Studio Flat for Rent',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
    ],
    category: 'Property',
    description: 'Compact 1RK studio near metro connectivity. Ideal for students or working professionals. Semi-furnished with attached bathroom.',
    area: 'Sabarmati',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-03'),
    seller: sellers[2],
    views: 412,
    isFavorite: false,
  },
  {
    id: 'listing-14',
    title: 'AC Repair and Service at Home',
    price: 799,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&h=800&fit=crop',
    ],
    category: 'Services',
    description: 'Doorstep AC service including gas check, basic cleaning, and performance testing. Same-day slots available in most areas.',
    area: 'Gota',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-02'),
    seller: sellers[2],
    views: 165,
    isFavorite: false,
  },
  {
    id: 'listing-15',
    title: 'Queen Size Bed with Storage',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop',
    ],
    category: 'Furniture',
    description: 'Solid wood queen bed with hydraulic storage. 2.5 years old and in very good condition. Mattress can be included at extra cost.',
    area: 'Bopal',
    city: 'Ahmedabad',
    postedAt: new Date('2024-01-01'),
    seller: sellers[3],
    views: 144,
    isFavorite: false,
  },
  {
    id: 'listing-16',
    title: 'Part-time Content Writer Needed',
    price: 0,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=800&fit=crop',
    ],
    category: 'Jobs',
    description: 'Hiring part-time content writer for blogs and product descriptions. Freshers can apply if writing samples are good.',
    area: 'CG Road',
    city: 'Ahmedabad',
    postedAt: new Date('2023-12-31'),
    seller: sellers[3],
    views: 539,
    isFavorite: false,
  },
  {
    id: 'listing-17',
    title: 'Used Cricket Kit (Bat, Pads, Gloves)',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=800&fit=crop',
    ],
    category: 'Others',
    description: 'Complete cricket kit in good condition. Great for school/college players. Slight wear on gloves but fully usable.',
    area: 'Nikol',
    city: 'Ahmedabad',
    postedAt: new Date('2023-12-30'),
    seller: sellers[1],
    views: 118,
    isFavorite: false,
  },
  {
    id: 'listing-18',
    title: 'Class 11 PCM Books + Notes Bundle',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=800&fit=crop',
    ],
    category: 'Stationery',
    description: 'Complete Class 11 Physics, Chemistry, and Maths books with handwritten notes and solved assignments. Good condition.',
    area: 'Paldi',
    city: 'Ahmedabad',
    postedAt: new Date('2023-12-29'),
    seller: sellers[0],
    views: 96,
    isFavorite: false,
  },
];

// User-added listings persisted locally
let userListings: Listing[] = loadUserListings();
if (userListings.length) {
  listings = [...userListings, ...listings];
}

export const addUserListing = (listing: Listing) => {
  listings.unshift(listing);
  userListings.unshift(listing);
  persistUserListings(userListings);
};

export const deleteUserListing = (listingId: string) => {
  listings = listings.filter((item) => item.id !== listingId);
  userListings = userListings.filter((item) => item.id !== listingId);
  persistUserListings(userListings);
};

// Categories with icons
export const categories: Category[] = [
  { id: 'farmer-products', name: 'Farmer Products', icon: 'Leaf', count: 42 },
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', count: 156 },
  { id: 'vehicles', name: 'Vehicles', icon: 'Car', count: 89 },
  { id: 'property', name: 'Property', icon: 'Home', count: 234 },
  { id: 'services', name: 'Services', icon: 'Wrench', count: 67 },
  { id: 'furniture', name: 'Furniture', icon: 'Sofa', count: 145 },
  { id: 'jobs', name: 'Jobs', icon: 'Briefcase', count: 78 },
  { id: 'aesthetic-products', name: 'Aesthetic Products', icon: 'Sparkles', count: 34 },
  { id: 'stationery', name: 'Stationery & Study Material', icon: 'BookOpen', count: 52 },
  { id: 'others', name: 'Others', icon: 'Package', count: 203 },
];

// Mock reviews
export const reviews: Review[] = [
  {
    id: 'review-1',
    reviewer: {
      name: 'Ankit Mehta',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=150&h=150&fit=crop&crop=face',
    },
    rating: 5,
    text: 'Excellent seller! Product was exactly as described. Quick response and smooth transaction.',
    date: new Date('2024-01-10'),
  },
  {
    id: 'review-2',
    reviewer: {
      name: 'Pooja Shah',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    },
    rating: 4,
    text: 'Good experience overall. Seller was punctual and the item was in good condition.',
    date: new Date('2024-01-05'),
  },
  {
    id: 'review-3',
    reviewer: {
      name: 'Rahul Joshi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    rating: 5,
    text: 'Super fast response! Got a great deal. Highly recommend this seller.',
    date: new Date('2023-12-28'),
  },
];

// Mock chat messages
export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    listing: listings[0],
    otherUser: sellers[0],
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        text: 'Hi, is this iPhone still available?',
        timestamp: new Date('2024-01-15T10:30:00'),
        isRead: true,
      },
      {
        id: 'msg-2',
        senderId: 'seller-1',
        text: 'Yes, it is! Are you interested?',
        timestamp: new Date('2024-01-15T10:32:00'),
        isRead: true,
      },
      {
        id: 'msg-3',
        senderId: 'user-1',
        text: 'Can you do 85,000?',
        timestamp: new Date('2024-01-15T10:35:00'),
        isRead: true,
      },
      {
        id: 'msg-4',
        senderId: 'seller-1',
        text: 'I can do 87,000. Final price. It\'s in mint condition.',
        timestamp: new Date('2024-01-15T10:40:00'),
        isRead: true,
      },
    ],
    lastMessageAt: new Date('2024-01-15T10:40:00'),
  },
  {
    id: 'chat-2',
    listing: listings[1],
    otherUser: sellers[1],
    messages: [
      {
        id: 'msg-5',
        senderId: 'user-1',
        text: 'Hello, I want to see the bike. When can I visit?',
        timestamp: new Date('2024-01-14T14:00:00'),
        isRead: true,
      },
      {
        id: 'msg-6',
        senderId: 'seller-2',
        text: 'Hi! You can come tomorrow evening around 5 PM. I\'ll share the location.',
        timestamp: new Date('2024-01-14T14:15:00'),
        isRead: false,
      },
    ],
    lastMessageAt: new Date('2024-01-14T14:15:00'),
  },
];

// Helper functions
export const formatPrice = (price: number): string => {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const getListingsByCategory = (category: string): Listing[] => {
  return listings.filter(listing => 
    listing.category.toLowerCase() === category.toLowerCase() ||
    listing.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const searchListings = (query: string): Listing[] => {
  const lowerQuery = query.toLowerCase();
  return listings.filter(listing =>
    listing.title.toLowerCase().includes(lowerQuery) ||
    listing.description.toLowerCase().includes(lowerQuery) ||
    listing.category.toLowerCase().includes(lowerQuery)
  );
};
