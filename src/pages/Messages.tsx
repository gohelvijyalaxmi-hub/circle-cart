import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { EmptyState } from '@/components/marketplace/EmptyState';
import { currentUser, formatTimeAgo } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

export default function Messages() {
  const { isLoggedIn, chats, user } = useApp();
  const activeUserId = user?.id ?? currentUser.id;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 safe-top">
          <h1 className="text-lg font-bold text-foreground">Messages</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground text-center mb-4">
            Login to see your messages
          </p>
          <Button asChild>
            <Link to="/">Browse Listings</Link>
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 safe-top">
        <h1 className="text-lg font-bold text-foreground">Messages</h1>
      </header>

      {/* Chat list */}
      <div className="divide-y divide-border">
        {chats.length === 0 ? (
          <EmptyState type="messages" />
        ) : (
          chats.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const isUnread =
              !!lastMessage &&
              !lastMessage.isRead &&
              lastMessage.senderId !== activeUserId;

            return (
              <Link
                key={chat.id}
                to={`/chat/${chat.otherUser.id}?listing=${chat.listing.id}`}
                className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
              >
                {/* Seller avatar */}
                <div className="relative">
                  <img
                    src={chat.otherUser.avatar}
                    alt={chat.otherUser.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {isUnread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                  )}
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {chat.otherUser.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(chat.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage ? (
                      <>
                        {lastMessage.senderId === activeUserId ? 'You: ' : ''}
                        {lastMessage.text}
                      </>
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={chat.listing.image}
                      alt={chat.listing.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="text-xs text-muted-foreground truncate">
                      {chat.listing.title}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </Link>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
