import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Cloud, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CloudStorageIntegrationProps {
  onFileSelect: (file: File) => void;
}

export function CloudStorageIntegration({ onFileSelect }: CloudStorageIntegrationProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleDrive = () => {
    toast({
      title: 'Google Drive Integration',
      description: 'This feature will be available soon! You\'ll be able to import files directly from Google Drive.',
    });
  };

  const handleDropbox = () => {
    toast({
      title: 'Dropbox Integration',
      description: 'This feature will be available soon! You\'ll be able to import files directly from Dropbox.',
    });
  };

  const handleOneDrive = () => {
    toast({
      title: 'OneDrive Integration',
      description: 'This feature will be available soon! You\'ll be able to import files directly from OneDrive.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Cloud className="w-4 h-4" />
          Import from Cloud
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleGoogleDrive} className="gap-2 cursor-pointer">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M7.71 3.5L1.15 15l3.42 6.5h13.96l3.42-6.5L14.88 3.5z"
            />
          </svg>
          <span>Google Drive</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDropbox} className="gap-2 cursor-pointer">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#0061FF"
              d="M6 2L0 5.5L6 9l6-3.5L6 2zm12 0l-6 3.5L18 9l6-3.5L18 2zM0 12.5L6 16l6-3.5L6 9 0 12.5zm18 0L12 16l6 3.5 6-3.5L18 12.5zM6 19.5L12 23l6-3.5L12 16l-6 3.5z"
            />
          </svg>
          <span>Dropbox</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOneDrive} className="gap-2 cursor-pointer">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#0364B8"
              d="M13.8 14.5c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5h9.5c2 0 3.7-1.7 3.7-3.7 0-2-1.7-3.7-3.7-3.7h-.1c-.4-3.4-3.3-6.1-6.9-6.1-2.8 0-5.2 1.7-6.3 4.1.7-.2 1.4-.4 2.1-.4 3.9 0 7.1 3.2 7.1 7.1 0 .5-.1 1-.2 1.4h.1c1.1 0 2-.9 2-2s-.9-2-2-2h-1.3c-.1 0-.1-.1-.1-.2z"
            />
          </svg>
          <span>OneDrive</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
