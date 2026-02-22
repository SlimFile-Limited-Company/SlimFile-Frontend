import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

/**
 * Listens for push messages forwarded by the service worker
 * and shows an in-app toast notification when the app is in the foreground.
 */
export default function PushListener() {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handler = (event: MessageEvent) => {
      if (event.data?.type !== 'PUSH_RECEIVED') return;
      const { title, body, data } = event.data.payload as {
        title: string;
        body: string;
        data?: { url?: string };
      };

      toast({
        title,
        description: body,
        duration: 5000,
        action: data?.url ? (
          <button
            onClick={() => navigate(data.url!)}
            className="shrink-0 rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors"
          >
            View
          </button>
        ) : undefined,
      } as any);
    };

    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  }, []);

  return null;
}
