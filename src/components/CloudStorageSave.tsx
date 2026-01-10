import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Cloud, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { isAuthenticated } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface CloudStorageSaveProps {
  file: File | null;
  fileName: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function CloudStorageSave({
  file,
  fileName,
  disabled = false,
  variant = 'outline',
  size = 'default',
  className = ''
}: CloudStorageSaveProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savingTo, setSavingTo] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSaveToCloud = async (provider: 'google-drive' | 'dropbox' | 'onedrive') => {
    if (!file) {
      toast({
        title: 'No File',
        description: 'No file available to save.',
        variant: 'destructive'
      });
      return;
    }

    if (!isAuthenticated()) {
      toast({
        title: 'Login Required',
        description: 'Please login to save files to cloud storage.',
        variant: 'default'
      });
      navigate('/login');
      return;
    }

    setIsSaving(true);
    setSavingTo(provider);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com';
      const token = localStorage.getItem('jwt');

      // Check if user has connected this cloud provider
      const checkResponse = await fetch(`${API_BASE_URL}/api/cloud/check/${provider}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { isConnected } = await checkResponse.json();

      if (!isConnected) {
        // Redirect to OAuth flow
        toast({
          title: 'Connect Account',
          description: `Please connect your ${getProviderName(provider)} account first.`,
        });

        // Store file in session for after OAuth
        const fileData = await fileToBase64(file);
        sessionStorage.setItem('pendingCloudSave', JSON.stringify({
          provider,
          fileName,
          fileData,
          fileType: file.type
        }));

        // Redirect to OAuth
        window.location.href = `${API_BASE_URL}/api/cloud/auth/${provider}?redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }

      // Upload file to cloud storage
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('provider', provider);

      const uploadResponse = await fetch(`${API_BASE_URL}/api/cloud/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to cloud storage');
      }

      const result = await uploadResponse.json();

      toast({
        title: 'Success!',
        description: `File saved to ${getProviderName(provider)} successfully.`,
      });

      console.log('Cloud save result:', result);

    } catch (error) {
      console.error('Cloud save error:', error);
      toast({
        title: 'Save Failed',
        description: `Failed to save file to ${getProviderName(provider)}. Please try again.`,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
      setSavingTo(null);
    }
  };

  const getProviderName = (provider: string): string => {
    const names: Record<string, string> = {
      'google-drive': 'Google Drive',
      'dropbox': 'Dropbox',
      'onedrive': 'OneDrive'
    };
    return names[provider] || provider;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={disabled || !file || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Cloud className="w-4 h-4 mr-2" />
              Save to Cloud
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleSaveToCloud('google-drive')}
          className="gap-2 cursor-pointer"
          disabled={isSaving}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M7.71 3.5L1.15 15l3.42 6.5h13.96l3.42-6.5L14.88 3.5z"
            />
            <path
              fill="#34A853"
              d="M1.15 15l3.42 6.5 6.14-3.5L7.71 3.5z"
            />
            <path
              fill="#FBBC04"
              d="M14.88 3.5l-7.17 14.5 6.14 3.5 7.1-12z"
            />
            <path
              fill="#EA4335"
              d="M21.85 15H1.15l3.42 6.5h13.96z"
            />
          </svg>
          <span>
            {savingTo === 'google-drive' ? 'Saving...' : 'Google Drive'}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleSaveToCloud('dropbox')}
          className="gap-2 cursor-pointer"
          disabled={isSaving}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#0061FF"
              d="M6 2L0 5.5L6 9l6-3.5L6 2zm12 0l-6 3.5L18 9l6-3.5L18 2zM0 12.5L6 16l6-3.5L6 9 0 12.5zm18 0L12 16l6 3.5 6-3.5L18 12.5zM6 19.5L12 23l6-3.5L12 16l-6 3.5z"
            />
          </svg>
          <span>
            {savingTo === 'dropbox' ? 'Saving...' : 'Dropbox'}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleSaveToCloud('onedrive')}
          className="gap-2 cursor-pointer"
          disabled={isSaving}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#0364B8"
              d="M13.8 14.5c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5h9.5c2 0 3.7-1.7 3.7-3.7 0-2-1.7-3.7-3.7-3.7h-.1c-.4-3.4-3.3-6.1-6.9-6.1-2.8 0-5.2 1.7-6.3 4.1.7-.2 1.4-.4 2.1-.4 3.9 0 7.1 3.2 7.1 7.1 0 .5-.1 1-.2 1.4h.1c1.1 0 2-.9 2-2s-.9-2-2-2h-1.3c-.1 0-.1-.1-.1-.2z"
            />
          </svg>
          <span>
            {savingTo === 'onedrive' ? 'Saving...' : 'OneDrive'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
