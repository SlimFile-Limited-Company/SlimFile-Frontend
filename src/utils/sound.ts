// Sound utility functions for playing notification sounds
export const playNotificationSound = (soundPath = '/sounds/notification.mp3') => {
  try {
    // Create audio element
    const audio = new Audio(soundPath);

    // Play the sound
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Sound played successfully
        })
        .catch(error => {
          // Fallback to generated beep sound if MP3 fails
          if (error.name === 'NotSupportedError') {
            playBeepSound();
          }
        });
    }

    // Clean up after playing
    audio.addEventListener('ended', () => {
      audio.remove();
    });

    // Handle errors
    audio.addEventListener('error', (error) => {
      // Fallback to generated beep sound if MP3 fails to load
      if (error.target && (error.target as HTMLAudioElement).error && (error.target as HTMLAudioElement).error!.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        playBeepSound();
      }
    });

  } catch (error) {
    // Ultimate fallback - try to play a beep sound
    playBeepSound();
  }
};

// Generate a simple beep sound using Web Audio API
const playBeepSound = () => {
  try {
    console.log('Playing generated beep sound...');
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create oscillator for beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure beep sound (440Hz for 200ms)
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.type = 'sine';

    // Volume envelope
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    // Play beep
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);

    console.log('Beep sound played successfully');

  } catch (error) {
    console.warn('Failed to play beep sound:', error);
  }
};

export const playSuccessSound = () => {
  playNotificationSound('/sounds/success-fanfare-trumpets-6185.mp3');
};

export const playErrorSound = () => {
  playNotificationSound('/sounds/error.mp3');
};
