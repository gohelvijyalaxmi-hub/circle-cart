import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BottomNav } from '@/components/layout/BottomNav';
import { currentUser } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const { detectedCity, user, updateUser } = useApp();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUser = user ?? currentUser;

  const [name, setName] = useState(activeUser.name);
  const [bio, setBio] = useState('Passionate about finding great deals and connecting with local buyers.');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [avatar, setAvatar] = useState(activeUser.avatar);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
      toast({
        title: 'Photo selected',
        description: 'Your new profile photo has been selected.',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      avatar,
    });
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
    navigate('/profile');
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
            <h1 className="text-lg font-bold text-foreground">Edit Profile</h1>
          </div>
          <Button variant="ghost" className="text-primary font-semibold" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-4 ring-secondary">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="text-sm text-primary font-medium mt-2"
          >
            Change Photo
          </button>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="mt-1.5 input-marketplace"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell buyers a bit about yourself..."
            className="mt-1.5 input-marketplace min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {bio.length}/200 characters
          </p>
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            className="mt-1.5 input-marketplace"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only shared with buyers when you approve
          </p>
        </div>

        {/* City (read-only) */}
        <div>
          <Label>Location</Label>
          <div className="mt-1.5 flex items-center gap-2 px-4 py-3 rounded-xl bg-muted">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{detectedCity}</span>
            <span className="text-xs text-muted-foreground ml-auto">Auto-detected</span>
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full h-12" size="lg">
          Save Changes
        </Button>
      </form>

      <BottomNav />
    </div>
  );
}
