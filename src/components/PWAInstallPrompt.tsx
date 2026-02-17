import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    console.log('PWA Install Prompt: Component mounted');
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    console.log('PWA Install Prompt: Is standalone?', isStandalone);
    
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Install Prompt: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA Install Prompt: App installed event fired');
      setIsInstalled(true);
      setShowPrompt(false);
    };

    // Check if the app is installable
    const checkInstallability = async () => {
      try {
        const response = await fetch('/manifest.json');
        if (response.ok) {
          console.log('PWA Install Prompt: Manifest is accessible');
          // Show prompt after a short delay if manifest is accessible
          timeoutRef.current = setTimeout(() => {
            console.log('PWA Install Prompt: Showing prompt after manifest check');
            setShowPrompt(true);
          }, 2000);
        } else {
          console.log('PWA Install Prompt: Manifest not accessible');
        }
      } catch (error) {
        console.log('PWA Install Prompt: Error checking manifest:', error);
      }
    };
    
    checkInstallability();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('PWA Install Prompt: Install button clicked');
    
    if (deferredPrompt) {
      console.log('PWA Install Prompt: Using deferred prompt');
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('PWA Install Prompt: User accepted the install prompt');
          setShowPrompt(false);
        } else {
          console.log('PWA Install Prompt: User dismissed the install prompt');
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.log('PWA Install Prompt: Error with deferred prompt:', error);
        showManualInstallInstructions();
      }
    } else {
      console.log('PWA Install Prompt: No deferred prompt, trying alternative methods');
      showManualInstallInstructions();
    }
  };

  const showManualInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);
    
    let message = '';
    
    if (isIOS) {
      message = 'To install SlimFile:\n1. Tap the Share button (square with arrow)\n2. Tap "Add to Home Screen"\n3. Tap "Add"';
    } else if (isAndroid) {
      message = 'To install SlimFile:\n1. Tap the menu button (three dots)\n2. Tap "Add to Home screen"\n3. Tap "Add"';
    } else if (isChrome || isEdge) {
      message = 'To install SlimFile:\n1. Look for the install icon (+ symbol) in your browser\'s address bar\n2. Click it and follow the prompts\n3. Or press Ctrl+Shift+I, go to Application tab, and look for "Install"';
    } else {
      message = 'To install SlimFile:\n1. Look for an install option in your browser\'s menu\n2. Or use your browser\'s developer tools to find the install option';
    }
    
    alert(message);
    
    // Hide the prompt after showing instructions
    setTimeout(() => {
      setShowPrompt(false);
    }, 3000);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-[88px] left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src="/lovable-uploads/logo.png"
                alt="SlimFile Logo"
                className="w-10 h-10 object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Install SlimFile</p>
              <p className="text-xs text-gray-600">Quick access to file compression</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="bg-primary text-white hover:bg-primary/90 font-medium rounded-full px-4 transition-all duration-200"
            >
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
              className="text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
