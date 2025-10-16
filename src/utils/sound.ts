// Sound utility functions for playing notification sounds
export const playNotificationSound = (soundPath = '/sounds/notification.mp3') => {
  try {
    // Create audio element
    const audio = new Audio(soundPath);

    // Play the sound
    audio.play().catch(error => {
      console.warn('Could not play notification sound:', error);
    });

    // Clean up after playing
    audio.addEventListener('ended', () => {
      audio.remove();
    });

    // Handle errors
    audio.addEventListener('error', (error) => {
      console.warn('Notification sound failed to load:', error);
    });

  } catch (error) {
    console.warn('Failed to play notification sound:', error);
  }
};

export const playSuccessSound = () => {
  playNotificationSound('/sounds/success.mp3');
};

export const playErrorSound = () => {
  playNotificationSound('/sounds/error.mp3');
};
