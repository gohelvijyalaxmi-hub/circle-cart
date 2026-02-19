import { cn } from '@/lib/utils';
import { Message } from '@/data/mockData';

interface ChatBubbleProps {
  message: Message;
  isSent: boolean;
}

export function ChatBubble({ message, isSent }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        'flex mb-3 animate-fade-in',
        isSent ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] px-4 py-2.5 rounded-2xl',
          isSent
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-secondary text-secondary-foreground rounded-bl-md'
        )}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p
          className={cn(
            'text-[10px] mt-1',
            isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {message.timestamp.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
