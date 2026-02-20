import { createContext, useContext, useState, ReactNode } from 'react';
import { Chat, currentUser, listings, mockChats, Seller, sellers } from '@/data/mockData';

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  loginWithCredentials: (username: string) => void;
  updateUser: (data: Partial<Seller>) => void;
  cartItems: string[];
  addToCart: (listingId: string) => void;
  removeFromCart: (listingId: string) => void;
  favoriteIds: string[];
  toggleFavorite: (listingId: string) => void;
  isHost: boolean;
  user: Seller | null;
  detectedCity: string;
  hasLocationPermission: boolean;
  setHasLocationPermission: (value: boolean) => void;
  requestDeviceLocation: () => Promise<boolean>;
  chats: Chat[];
  startChat: (sellerId: string, listingId?: string) => void;
  sendChatMessage: (
    sellerId: string,
    listingId: string | undefined,
    text: string,
    senderId?: string
  ) => void;
  markChatAsRead: (sellerId: string, listingId?: string) => void;
  isGuest: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [user, setUser] = useState<Seller | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const stored = localStorage.getItem('favoriteIds');
    return stored ? JSON.parse(stored) : [];
  });
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [hasLocationPermission, setHasLocationPermissionState] = useState(
    localStorage.getItem('hasLocationPermission') === 'true'
  );
  const [detectedCity, setDetectedCity] = useState(
    localStorage.getItem('detectedCity') || 'Location not detected'
  );
  const hostUsernames = new Set(['coplspury', 'admin', 'host', 'projecthost']);

  const setIsLoggedIn = (value: boolean) => {
    setIsLoggedInState(value);
    if (!value) {
      setUser(null);
      setCartItems([]);
    }
  };

  const loginWithCredentials = (username: string) => {
    const trimmedUsername = username.trim() || currentUser.name;
    const normalizedId = trimmedUsername
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const loggedInUser: Seller = {
      ...currentUser,
      id: `user-${normalizedId || 'local'}`,
      name: trimmedUsername,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedUsername)}&background=0D8ABC&color=fff`,
      city: detectedCity,
      memberSince: new Date(),
    };

    setUser(loggedInUser);
    setIsLoggedInState(true);
  };

  const updateUser = (data: Partial<Seller>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const addToCart = (listingId: string) => {
    setCartItems((prev) => (prev.includes(listingId) ? prev : [...prev, listingId]));
  };

  const removeFromCart = (listingId: string) => {
    setCartItems((prev) => prev.filter((item) => item !== listingId));
  };

  const toggleFavorite = (listingId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(listingId);
      const next = exists ? prev.filter((id) => id !== listingId) : [listingId, ...prev];
      localStorage.setItem('favoriteIds', JSON.stringify(next));
      return next;
    });
  };

  const resolveChatIndex = (items: Chat[], sellerId: string, listingId?: string) => {
    if (listingId) {
      const exactMatch = items.findIndex(
        (chat) => chat.otherUser.id === sellerId && chat.listing.id === listingId
      );
      if (exactMatch >= 0) return exactMatch;
    }
    return items.findIndex((chat) => chat.otherUser.id === sellerId);
  };

  const buildChat = (sellerId: string, listingId?: string): Chat | null => {
    const seller = sellers.find((item) => item.id === sellerId);
    if (!seller) return null;

    const listingForChat =
      (listingId && listings.find((item) => item.id === listingId)) ||
      listings.find((item) => item.seller.id === sellerId);

    if (!listingForChat) return null;

    return {
      id: `chat-${sellerId}-${listingForChat.id}`,
      otherUser: seller,
      listing: listingForChat,
      messages: [],
      lastMessageAt: new Date(),
    };
  };

  const startChat = (sellerId: string, listingId?: string) => {
    setChats((prev) => {
      const existingIndex = resolveChatIndex(prev, sellerId, listingId);
      if (existingIndex >= 0) return prev;
      const chat = buildChat(sellerId, listingId);
      if (!chat) return prev;
      return [chat, ...prev];
    });
  };

  const sendChatMessage = (
    sellerId: string,
    listingId: string | undefined,
    text: string,
    senderId?: string
  ) => {
    const content = text.trim();
    if (!content) return;

    const activeSenderId = senderId ?? user?.id ?? currentUser.id;

    setChats((prev) => {
      const next = [...prev];
      let index = resolveChatIndex(next, sellerId, listingId);

      if (index < 0) {
        const created = buildChat(sellerId, listingId);
        if (!created) return prev;
        next.unshift(created);
        index = 0;
      }

      const targetChat = next[index];
      const newMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        senderId: activeSenderId,
        text: content,
        timestamp: new Date(),
        isRead: activeSenderId !== (user?.id ?? currentUser.id),
      };

      const updatedChat: Chat = {
        ...targetChat,
        messages: [...targetChat.messages, newMessage],
        lastMessageAt: newMessage.timestamp,
      };

      next.splice(index, 1);
      next.unshift(updatedChat);
      return next;
    });
  };

  const markChatAsRead = (sellerId: string, listingId?: string) => {
    const activeUserId = user?.id ?? currentUser.id;
    setChats((prev) =>
      prev.map((chat) => {
        const isTarget =
          chat.otherUser.id === sellerId &&
          (!listingId || chat.listing.id === listingId);

        if (!isTarget) return chat;

        return {
          ...chat,
          messages: chat.messages.map((message) =>
            message.senderId !== activeUserId ? { ...message, isRead: true } : message
          ),
        };
      })
    );
  };

  const setHasLocationPermission = (value: boolean) => {
    setHasLocationPermissionState(value);
    localStorage.setItem('hasLocationPermission', String(value));
  };

  const requestDeviceLocation = async () => {
    if (!navigator.geolocation) {
      setHasLocationPermission(false);
      setDetectedCity('Geolocation not supported');
      localStorage.setItem('detectedCity', 'Geolocation not supported');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let resolvedCity = `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );

            if (response.ok) {
              const data = await response.json();
              const address = data?.address ?? {};
              resolvedCity =
                address.city ||
                address.town ||
                address.village ||
                address.county ||
                resolvedCity;
            }
          } catch {
            // Keep coordinate fallback when reverse geocoding fails.
          }

          setDetectedCity(resolvedCity);
          localStorage.setItem('detectedCity', resolvedCity);
          setHasLocationPermission(true);
          resolve(true);
        },
        () => {
          setHasLocationPermission(false);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const isHost = Boolean(
    user && hostUsernames.has(user.name.trim().toLowerCase())
  );

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: isLoggedInState,
        setIsLoggedIn,
        loginWithCredentials,
        updateUser,
        cartItems,
        addToCart,
        removeFromCart,
        favoriteIds,
        toggleFavorite,
        isHost,
        user,
        detectedCity,
        hasLocationPermission,
        setHasLocationPermission,
        requestDeviceLocation,
        chats,
        startChat,
        sendChatMessage,
        markChatAsRead,
        isGuest: !isLoggedInState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
