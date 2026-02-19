import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BottomNav } from '@/components/layout/BottomNav';
import { categories, currentUser, addUserListing } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function PostListing() {
  const navigate = useNavigate();
  const { detectedCity, user } = useApp();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open file picker for image upload
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && images.length < 5) {
      const remaining = 5 - images.length;
      const selected = Array.from(files).slice(0, remaining);
      try {
        const dataUrls = await Promise.all(selected.map(fileToDataUrl));
        setImages((prev) => [...prev, ...dataUrls]);
      } catch (err) {
        console.error('Failed to read images', err);
      }
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sellerForListing = user ?? currentUser;
    const priceValue = Number(price) || 0;
    const now = new Date();
    const fallbackImage = '/placeholder.svg';
    const listingImages = images.length ? images : [fallbackImage];
    const selectedCat = categories.find((cat) => cat.id === category);
    const categoryValue = selectedCat ? selectedCat.id : category || 'others';

    const newListing = {
      id: `listing-${Date.now()}`,
      title: title.trim() || 'Untitled listing',
      price: priceValue,
      image: listingImages[0],
      images: listingImages,
      category: categoryValue,
      description: description.trim(),
      area: 'City Center',
      city: detectedCity,
      postedAt: now,
      seller: sellerForListing,
      views: 0,
      isFavorite: false,
    };

    addUserListing(newListing);

    toast({
      title: 'Listing posted!',
      description: 'Your listing is now live in ' + detectedCity,
    });
    navigate('/my-listings');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 safe-top">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Post a Listing</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Image upload */}
        <div>
          <Label className="text-sm font-medium">Photos (up to 5)</Label>
          <div className="flex gap-2 mt-2 overflow-x-auto hide-scrollbar pb-2">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button
                type="button"
                onClick={handleImageUpload}
                className="w-24 h-24 flex-shrink-0 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs">Add</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you selling?"
            className="mt-1.5 input-marketplace"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item in detail..."
            className="mt-1.5 input-marketplace min-h-[120px] resize-none"
            required
          />
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="mt-1.5 input-marketplace"
            required
          />
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger className="mt-1.5 input-marketplace">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City (read-only) */}
        <div>
          <Label>City</Label>
          <div className="mt-1.5 flex items-center gap-2 px-4 py-3 rounded-xl bg-muted">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{detectedCity}</span>
            <span className="text-xs text-muted-foreground ml-auto">Auto-detected</span>
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full h-12" size="lg">
          Post Listing
        </Button>
      </form>

      <BottomNav />
    </div>
  );
}
