// Sound utility functions for playing notification sounds
export const playNotificationSound = (soundPath = '/sounds/notification.mp3') => {
  try {
    console.log('Attempting to play sound from path:', soundPath);

    // Create audio element
    const audio = new Audio(soundPath);

    // Play the sound
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Sound played successfully');
        })
        .catch(error => {
          console.warn('Could not play notification sound:', error);
        });
    }

    // Clean up after playing
    audio.addEventListener('ended', () => {
      console.log('Sound playback ended');
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
  playNotificationSound('/sounds/success-fanfare-trumpets-6185.mp3');
};

export const playErrorSound = () => {
  playNotificationSound('/sounds/error.mp3');
};
