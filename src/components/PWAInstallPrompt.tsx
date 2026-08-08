import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  // Get or create session ID for tracking
  const getSessionId = () => {
    let sessionId = localStorage.getItem('slimfile-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('slimfile-session-id', sessionId);
    }
    return sessionId;
  };

  // Detect platform
  const getPlatform = () => {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'mobile';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
  };

  // Record PWA install to backend
  const recordInstall = async () => {
    try {
      const sessionId = getSessionId();
      const platform = getPlatform();

      const response = await fetch(`${API_BASE_URL}/pwa-installs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, platform })
      });

      if (response.ok) {
        console.log('PWA Install Prompt: Install recorded successfully');
      } else {
        console.error('PWA Install Prompt: Failed to record install');
      }
    } catch (error) {
      console.error('PWA Install Prompt: Error recording install:', error);
    }
  };

  useEffect(() => {
    console.log('PWA Install Prompt: Component mounted');

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

    console.log('PWA Install Prompt: Is standalone?', isStandalone);

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Install Prompt: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA Install Prompt: App installed event fired');
      setIsInstalled(true);
      setShowPrompt(false);
      // Record install to backend
      recordInstall();
    };

    const checkInstallability = async () => {
      try {
        const response = await fetch('/manifest.json');
        if (response.ok) {
          console.log('PWA Install Prompt: Manifest is accessible');
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
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.log('PWA Install Prompt: Error with deferred prompt:', error);
        showManualInstallInstructions();
      }
    } else {
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
      message = 'To install SlimFile:\n1. Look for the install icon (+ symbol) in your browser\'s address bar\n2. Click it and follow the prompts';
    } else {
      message = 'To install SlimFile:\n1. Look for an install option in your browser\'s menu';
    }

    alert(message);
    setTimeout(() => setShowPrompt(false), 3000);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary to-primary/80 px-6 pt-8 pb-6 text-white text-center">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/lovable-uploads/logo.png"
                alt="SlimFile Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold">Install SlimFile</h2>
            <p className="text-sm text-white/80 mt-1">Get the full app experience</p>
          </div>

          {/* Features */}
          <div className="px-6 py-5 space-y-3">
            {[
              'Launch SlimFile like a native app',
              'Smoother, faster experience every time',
              'Always one tap away on your device',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="flex-1 rounded-xl border-gray-200 text-gray-600"
            >
              Not now
            </Button>
            <Button
              onClick={handleInstallClick}
              className="flex-1 rounded-xl bg-primary text-white hover:bg-primary/90 gap-2"
            >
              <Download className="w-4 h-4" />
              Install
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
