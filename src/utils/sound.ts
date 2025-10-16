// Sound utility functions for playing notification sounds
export const playNotificationSound = (soundPath = '/sounds/notification.mp3') => {
  try {
    console.log('🎵 Attempting to play sound from path:', soundPath);

    // Create audio element
    const audio = new Audio(soundPath);
    console.log('🎵 Audio element created for:', soundPath);

    // Play the sound
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ Sound played successfully');
        })
        .catch(error => {
          console.warn('❌ Could not play notification sound:', error);
          console.log('🔄 Error type:', error.name, '- Trying fallback beep sound...');
          // Fallback to generated beep sound if MP3 fails
          if (error.name === 'NotSupportedError' || error.name === 'NotAllowedError') {
            playBeepSound();
          }
        });
    }

    // Clean up after playing
    audio.addEventListener('ended', () => {
      console.log('🎵 Sound playback ended');
      audio.remove();
    });

    // Handle errors
    audio.addEventListener('error', (error) => {
      console.warn('❌ Notification sound failed to load:', error);
      console.log('🔄 MP3 load failed, trying fallback beep sound...');
      // Fallback to generated beep sound if MP3 fails to load
      if (error.target && (error.target as HTMLAudioElement).error) {
        const errorCode = (error.target as HTMLAudioElement).error!.code;
        console.log('🔍 MP3 Error code:', errorCode);
        if (errorCode === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || errorCode === MediaError.MEDIA_ERR_DECODE) {
          playBeepSound();
        }
      }
    });

  } catch (error) {
    console.warn('💥 Failed to play notification sound:', error);
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

// Test function to debug MP3 loading
export const testSoundLoading = () => {
  console.log('🧪 Testing sound file loading...');
  const testAudio = new Audio('/sounds/success-fanfare-trumpets-6185.mp3');
  testAudio.addEventListener('loadstart', () => console.log('📡 Sound file load started'));
  testAudio.addEventListener('loadeddata', () => console.log('✅ Sound file loaded successfully'));
  testAudio.addEventListener('error', (e) => {
    console.error('❌ Sound file failed to load:', e);
    if ((e.target as HTMLAudioElement).error) {
      console.error('🔍 Error code:', (e.target as HTMLAudioElement).error!.code);
      console.error('🔍 Error message:', (e.target as HTMLAudioElement).error!.message);
    }
  });
};
