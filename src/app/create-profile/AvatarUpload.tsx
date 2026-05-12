'use client';

import { useState, useRef } from 'react';
import { Upload, User, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface AvatarUploadProps {
  currentUrl: string;
  onUpload: (url: string) => void;
}

export function AvatarUpload({ currentUrl, onUpload }: AvatarUploadProps) {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.warning('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUpload(data.url);
      toast.success('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
      setPreviewUrl(currentUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-500">
              <User className="h-12 w-12" />
            </div>
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
        <p className="mt-2 text-sm text-slate-500">
          JPG, PNG or GIF • Max 5MB
        </p>
      </div>
    </div>
  );
}

