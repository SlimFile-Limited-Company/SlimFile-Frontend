# Notification Sound File Required

To enable the notification sound feature, you need to add an audio file to this directory.

## Required Files:
- `/public/sounds/success.mp3` - A pleasant success/completion sound
- `/public/sounds/notification.mp3` - General notification sound (optional)
- `/public/sounds/error.mp3` - Error sound (optional)

## Recommended Sound Characteristics:
- Duration: 0.5 - 2 seconds
- Format: MP3 or WAV
- Volume: Moderate (not too loud)
- Type: Pleasant chime, bell, or success sound

## Free Sound Resources:
- Freesound.org
- Zapsplat.com
- Notification-sounds.com

## Alternative: Generate with Web Audio API
The sound utility also supports programmatic sound generation if no file is found.

Place your chosen sound file as `success.mp3` in this `/public/sounds/` directory.
