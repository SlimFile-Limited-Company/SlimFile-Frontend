export const registerServiceWorker = async () => {
  console.log('PWA: Registering service worker...');
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('PWA: Service worker registered successfully:', registration);
    } catch (registrationError) {
      console.log('PWA: Service worker registration failed:', registrationError);
    }
  } else {
    console.log('PWA: Service worker not supported');
  }
};

export const checkIfInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}; 