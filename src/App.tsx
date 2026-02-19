import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";

// Pages
import Login from "./pages/Login";
import LocationPermission from "./pages/LocationPermission";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import CategoryListings from "./pages/CategoryListings";
import ListingDetail from "./pages/ListingDetail";
import PostListing from "./pages/PostListing";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Verification from "./pages/Verification";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Favorites from "./pages/Favorites";
import MyListings from "./pages/MyListings";
import MyOrders from "./pages/MyOrders";
import Trusted from "./pages/Trusted";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { hasLocationPermission, isLoggedIn } = useApp();

  // Redirect to login first
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Redirect to location permission if not granted
  if (!hasLocationPermission) {
    return (
      <Routes>
        <Route path="*" element={<LocationPermission />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:categoryId" element={<CategoryListings />} />
      <Route path="/listing/:listingId" element={<ListingDetail />} />
      <Route path="/post" element={<PostListing />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/chat/:sellerId" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:sellerId" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/reviews/:sellerId" element={<Reviews />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/my-listings" element={<MyListings />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/trusted" element={<Trusted />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
