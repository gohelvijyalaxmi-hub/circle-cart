import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Send, Image, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatBubble } from '@/components/marketplace/ChatBubble';
import { currentUser, listings, sellers, formatPrice } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Chat() {
  const { sellerId } = useParams();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listing');
  const { toast } = useToast();
  const { chats, startChat, sendChatMessage, markChatAsRead, user } = useApp();
  const [message, setMessage] = useState('');
  const activeUserId = user?.id ?? currentUser.id;

  const seller = sellers.find((s) => s.id === sellerId);
  const listing = listings.find((l) => l.id === listingId);
  const activeChat = useMemo(() => {
    if (!sellerId) return undefined;
    return chats.find((chat) => {
      if (chat.otherUser.id !== sellerId) return false;
      if (listingId && chat.listing.id !== listingId) return false;
      return true;
    });
  }, [chats, sellerId, listingId]);
  const messages = activeChat?.messages ?? [];

  useEffect(() => {
    if (!sellerId) return;
    startChat(sellerId, listingId ?? undefined);
  }, [sellerId, listingId, startChat]);

  useEffect(() => {
    if (!sellerId) return;
    markChatAsRead(sellerId, listingId ?? undefined);
  }, [sellerId, listingId, markChatAsRead, messages.length]);

  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Seller not found</p>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!sellerId) return;
    sendChatMessage(sellerId, listingId ?? undefined, message, activeUserId);
    setMessage('');

    // Simulated seller reply to keep two-way conversation active in demo mode.
    window.setTimeout(() => {
      sendChatMessage(
        sellerId,
        listingId ?? undefined,
        `Thanks for your message. I will get back to you shortly.`,
        sellerId
      );
    }, 900);
  };

  const handleBlock = () => {
    toast({
      title: 'User blocked',
      description: `${seller.name} has been blocked.`,
    });
  };

  const handleReport = () => {
    toast({
      title: 'Report submitted',
      description: 'Thank you for keeping the community safe.',
    });
  };

  const handleCallSeller = () => {
    toast({
      title: 'Calling is not available yet',
      description: `You can continue chat with ${seller.name} for now.`,
    });
  };

  const handleAttachImage = () => {
    toast({
      title: 'Image upload coming soon',
      description: 'Attachment feature will be available in a future update.',
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-top">
        <div className="flex items-center gap-3">
          <Link
            to="/messages"
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground truncate">{seller.name}</h1>
            <p className="text-xs text-muted-foreground">
              {seller.responseRate}% response rate
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCallSeller}>
                <Phone className="w-4 h-4 mr-2" />
                Call Seller
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlock} className="text-destructive">
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReport} className="text-destructive">
                Report User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Listing preview */}
      {listing && (
        <Link
          to={`/listing/${listing.id}`}
          className="flex items-center gap-3 p-3 bg-secondary/50 border-b border-border"
        >
          <img
            src={listing.image}
            alt={listing.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground truncate">
              {listing.title}
            </p>
            <p className="text-sm text-primary font-semibold">
              {formatPrice(listing.price)}
            </p>
          </div>
        </Link>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a conversation about this listing
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isSent={msg.senderId === activeUserId}
            />
          ))
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="sticky bottom-0 bg-card border-t border-border p-4 safe-bottom"
      >
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={handleAttachImage}
          >
            <Image className="w-5 h-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input-marketplace"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim()}
            className="flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
