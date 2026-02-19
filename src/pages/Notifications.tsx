import { ArrowLeft, Bell, MessageCircle, Tag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'message' | 'price_drop' | 'review' | 'system';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  image?: string;
  link?: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message from Priya Sharma',
    description: 'I can do 87,000. Final price.',
    time: '2m ago',
    isRead: false,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    link: '/chat/seller-1',
  },
  {
    id: '2',
    type: 'price_drop',
    title: 'Price dropped!',
    description: 'iPhone 14 Pro Max is now ₹85,000',
    time: '1h ago',
    isRead: false,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=150',
    link: '/listing/listing-1',
  },
  {
    id: '3',
    type: 'review',
    title: 'New review received',
    description: 'Ankit Mehta gave you 5 stars',
    time: '3h ago',
    isRead: true,
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=150',
    link: '/reviews/user-1',
  },
  {
    id: '4',
    type: 'system',
    title: 'Verification complete',
    description: 'Your profile is now verified',
    time: '1d ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'message',
    title: 'New message from Amit Kumar',
    description: 'You can come tomorrow evening around 5 PM',
    time: '2d ago',
    isRead: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    link: '/chat/seller-2',
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'message':
      return <MessageCircle className="w-4 h-4" />;
    case 'price_drop':
      return <Tag className="w-4 h-4" />;
    case 'review':
      return <Star className="w-4 h-4" />;
    case 'system':
      return <Bell className="w-4 h-4" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'message':
      return 'bg-primary/10 text-primary';
    case 'price_drop':
      return 'bg-success/10 text-success';
    case 'review':
      return 'bg-warning/10 text-warning';
    case 'system':
      return 'bg-muted text-muted-foreground';
  }
};

export default function Notifications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    toast({
      title: 'All notifications marked as read',
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item
      )
    );

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary text-sm"
            onClick={handleMarkAllRead}
          >
            Mark all read
          </Button>
        </div>
      </header>

      {/* Notifications List */}
      <div className="divide-y divide-border">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => handleNotificationClick(notification)}
            className={cn(
              'w-full text-left flex items-start gap-3 p-4 transition-colors hover:bg-muted/50',
              !notification.isRead && 'bg-primary/5'
            )}
          >
            {notification.image ? (
              <img
                src={notification.image}
                alt=""
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                  getNotificationColor(notification.type)
                )}
              >
                {getNotificationIcon(notification.type)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    'text-sm line-clamp-1',
                    !notification.isRead ? 'font-semibold text-foreground' : 'text-foreground'
                  )}
                >
                  {notification.title}
                </p>
                {!notification.isRead && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                {notification.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
            </div>
          </button>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium">No notifications</p>
          <p className="text-sm text-muted-foreground mt-1">
            You're all caught up!
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
