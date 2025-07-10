import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAudioManager } from '@/hooks/useAudioManager';

export default function AudioControls() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    tracks,
    currentTrack,
    isPlaying,
    volume,
    isEnabled,
    playTrack,
    stopTrack,
    togglePlayPause,
    setVolume,
    setIsEnabled,
  } = useAudioManager();

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const handleTrackSelect = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      playTrack(track);
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="cyber-button rounded-full w-12 h-12 p-0"
        >
          <Music className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="glass-morphism neon-border bg-transparent w-80">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-cyan-400 text-sm font-mono">AUDIO CONTROLS</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-cyan-400 hover:text-white"
            >
              ×
            </Button>
          </div>

          <div className="space-y-4">
            {/* Audio Enable Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-green-400">Enable Audio</span>
              <Switch
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                className="data-[state=checked]:bg-green-400"
              />
            </div>

            {isEnabled && (
              <>
                {/* Track Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-mono text-cyan-400">Track</label>
                  <Select value={currentTrack?.id || ''} onValueChange={handleTrackSelect}>
                    <SelectTrigger className="bg-gray-900/50 border-green-400/30 text-white">
                      <SelectValue placeholder="Select audio track" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-green-400/30">
                      {tracks.map((track) => (
                        <SelectItem key={track.id} value={track.id} className="text-white hover:bg-gray-800">
                          {track.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={togglePlayPause}
                    disabled={!currentTrack}
                    className="cyber-button flex-1"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'PAUSE' : 'PLAY'}
                  </Button>
                  <Button
                    onClick={stopTrack}
                    disabled={!currentTrack}
                    className="cyber-button"
                  >
                    STOP
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {volume > 0 ? (
                      <Volume2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm font-mono text-cyan-400">
                      Volume: {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Current Track Info */}
                {currentTrack && (
                  <div className="text-center p-2 bg-gray-900/30 rounded">
                    <div className="text-sm font-mono text-green-400">
                      {isPlaying ? 'NOW PLAYING' : 'READY'}
                    </div>
                    <div className="text-xs text-white">{currentTrack.name}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}