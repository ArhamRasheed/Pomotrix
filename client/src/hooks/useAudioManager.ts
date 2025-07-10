import { useState, useRef, useEffect } from 'react';

export type AudioTrack = {
  id: string;
  name: string;
  url: string;
  type: 'ambient' | 'focus' | 'break';
};

const audioTracks: AudioTrack[] = [
  { id: 'matrix-ambient', name: 'Matrix Ambient', url: '/audio/matrix-ambient.mp3', type: 'ambient' },
  { id: 'rain', name: 'Rain Sounds', url: '/audio/rain.mp3', type: 'ambient' },
  { id: 'typing', name: 'Typing Sounds', url: '/audio/typing.mp3', type: 'focus' },
  { id: 'spaceship', name: 'Spaceship Hum', url: '/audio/spaceship.mp3', type: 'ambient' },
  { id: 'lofi', name: 'Lo-Fi Beats', url: '/audio/lofi.mp3', type: 'focus' },
];

export function useAudioManager() {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isEnabled, setIsEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      
      // Handle audio events
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.warn('Audio playback error:', e);
        setIsPlaying(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = async (track: AudioTrack) => {
    if (!audioRef.current || !isEnabled) return;

    try {
      // Stop current track if different
      if (currentTrack?.id !== track.id) {
        audioRef.current.pause();
        audioRef.current.src = track.url;
        setCurrentTrack(track);
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.warn('Failed to play audio:', error);
      // Create synthetic ambient audio using Web Audio API as fallback
      createSyntheticAmbient(track.type);
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      stopTrack();
    } else {
      playTrack(currentTrack);
    }
  };

  // Create synthetic ambient sounds using Web Audio API
  const createSyntheticAmbient = (type: string) => {
    if (!isEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (type === 'ambient') {
        // Create a simple ambient drone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 2);
        
        oscillator.start();
        setIsPlaying(true);
        
        // Auto-stop after 30 minutes
        setTimeout(() => {
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
          setTimeout(() => {
            oscillator.stop();
            setIsPlaying(false);
          }, 2000);
        }, 30 * 60 * 1000);
      }
    } catch (error) {
      console.warn('Failed to create synthetic audio:', error);
    }
  };

  return {
    tracks: audioTracks,
    currentTrack,
    isPlaying,
    volume,
    isEnabled,
    playTrack,
    stopTrack,
    togglePlayPause,
    setVolume,
    setIsEnabled,
  };
}