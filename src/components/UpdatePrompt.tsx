import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Detects when a new version of SlimFile has been deployed.
 * Shows a banner prompting users to update, or auto-reloads after a short delay.
 */
export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      // Poll for updates every 30 seconds so deployments are caught quickly
      if (registration) {
        setInterval(() => registration.update(), 30_000);
      }
    },
  });

  // Auto-reload after 10 seconds if user doesn't click — they see the countdown
  useEffect(() => {
    if (!needRefresh) return;
    const id = setTimeout(() => updateServiceWorker(true), 10_000);
    return () => clearTimeout(id);
  }, [needRefresh, updateServiceWorker]);

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 bg-gray-900 border border-gray-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 w-[calc(100%-2rem)] max-w-md">
      <div className="flex-1 min-w-0">
        <p className="font-semibold leading-none mb-0.5">New version available</p>
        <p className="text-gray-400 text-xs font-normal">SlimFile was just updated. Reload to get the latest.</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => setNeedRefresh(false)}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          Later
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-4 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-500 text-white transition-colors font-semibold"
        >
          Update now
        </button>
      </div>
    </div>
  );
}
