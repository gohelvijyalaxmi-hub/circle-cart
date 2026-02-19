import { ArrowLeft, User, Bell, Shield, Moon, Sun, HelpCircle, LogOut, ChevronRight, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BottomNav } from '@/components/layout/BottomNav';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

interface SettingItem {
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: 'link' | 'toggle' | 'button';
  value?: boolean;
  href?: string;
  onClick?: () => void;
  onToggle?: () => void;
}

export default function Settings() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useApp();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/');
  };

  const handleHelpCenter = () => {
    toast({
      title: 'Help center',
      description: 'Support page is coming soon.',
    });
  };

  const handleAppVersion = () => {
    toast({
      title: 'App Version',
      description: 'You are using v1.0.0',
    });
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          description: 'Update your personal information',
          action: 'link' as const,
          href: '/edit-profile',
        },
        {
          icon: Shield,
          label: 'Verification',
          description: 'Verify your identity',
          action: 'link' as const,
          href: '/verification',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Receive alerts for messages and updates',
          action: 'toggle' as const,
          value: notifications,
          onToggle: () => setNotifications(!notifications),
        },
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: 'Dark Mode',
          description: theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme',
          action: 'toggle' as const,
          value: theme === 'dark',
          onToggle: toggleTheme,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'Get help and support',
          action: 'button' as const,
          onClick: handleHelpCenter,
        },
        {
          icon: Smartphone,
          label: 'App Version',
          description: 'v1.0.0',
          action: 'button' as const,
          onClick: handleAppVersion,
        },
      ],
    },
  ];

  const handleSettingClick = (item: SettingItem) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleSettingClick(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                  {item.action === 'toggle' && (
                    <Switch
                      checked={item.value}
                      onCheckedChange={() => item.onToggle?.()}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {item.action === 'link' && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Made with {'<3'} in Ahmedabad
        </p>
      </div>

      <BottomNav />
    </div>
  );
}


