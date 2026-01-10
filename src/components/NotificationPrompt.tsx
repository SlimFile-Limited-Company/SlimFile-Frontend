import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission
} from '@/services/pushNotificationService';

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if we should show the prompt
    const checkShouldShowPrompt = () => {
      // Don't show if notifications not supported
      if (!isNotificationSupported()) {
        return false;
      }

      const currentPermission = getNotificationPermission();
      setPermission(currentPermission);

      // Don't show if already granted or denied
      if (currentPermission !== 'default') {
        return false;
      }

      // Check if user dismissed the prompt recently
      const lastDismissed = localStorage.getItem('notificationPromptDismissed');
      if (lastDismissed) {
        const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
        // Show again after 7 days
        return daysSinceDismissed > 7;
      }

      return true;
    };

    // Show prompt after 5 seconds
    const timer = setTimeout(() => {
      if (checkShouldShowPrompt()) {
        setShowPrompt(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationPromptDismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <Card className="shadow-2xl border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Enable Notifications
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Get notified when your files are compressed and receive achievement updates!
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={handleEnable}
                    size="sm"
                    className="flex-1"
                  >
                    Enable
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Not Now
                  </Button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
