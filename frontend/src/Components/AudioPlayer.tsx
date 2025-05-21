import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { PlayCircle, PauseCircle, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

interface AudioPlayerProps {
  audioFile?: File;
  audioSrc?: string;
}

function AudioPlayer({ audioFile, audioSrc }: AudioPlayerProps) {
  const theme = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [localAudioSrc, setLocalAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // Set volume
    audio.volume = volume;

    // Handle file input or direct src
    if (audioFile) {
      // Create URL for the file
      const fileUrl = URL.createObjectURL(audioFile);
      setLocalAudioSrc(fileUrl);
      audio.src = fileUrl;
    } else if (audioSrc) {
      setLocalAudioSrc(audioSrc);
      audio.src = audioSrc;
    }

    // Cleanup
    return () => {
      audio.pause();
      if (localAudioSrc) {
        URL.revokeObjectURL(localAudioSrc);
      }
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [audioFile, audioSrc]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (_: Event, value: number | number[]) => {
    if (!audioRef.current) return;
    
    const newTime = typeof value === 'number' ? value : value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const newVolume = typeof value === 'number' ? value : value[0];
    setVolume(newVolume);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get volume icon based on level
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Waveform Visualization */}
      <Box
        sx={{
          height: 60,
          bgcolor: 'background.default',
          borderRadius: 1,
          position: 'relative',
          overflow: 'hidden',
          mb: 1,
        }}
      >
        {/* Mock waveform visualization */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px',
            }}
          >
            {Array.from({ length: 50 }).map((_, i) => {
              // Create a randomized but somewhat smooth waveform
              const barHeight = 10 + Math.sin(i * 0.5) * 10 + Math.random() * 20;
              const isActive = (i / 50) * duration <= currentTime;
              
              return (
                <Box
                  key={i}
                  sx={{
                    width: 3,
                    height: `${barHeight}px`,
                    bgcolor: isActive 
                      ? theme.palette.primary.main 
                      : theme.palette.divider,
                    borderRadius: 1,
                    transition: 'height 0.2s ease',
                    mx: 0.25,
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Player Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={togglePlay} color="primary">
          {isPlaying ? <PauseCircle size={36} /> : <PlayCircle size={36} />}
        </IconButton>
        
        <Typography variant="body2" color="textSecondary" sx={{ mx: 1, minWidth: 45 }}>
          {formatTime(currentTime)}
        </Typography>
        
        <Slider
          value={currentTime}
          max={duration || 100}
          onChange={handleTimeChange}
          aria-label="Time"
          size="small"
          sx={{ mx: 1 }}
        />
        
        <Typography variant="body2" color="textSecondary" sx={{ mx: 1, minWidth: 45 }}>
          {formatTime(duration)}
        </Typography>
      </Box>

      {/* Volume Control */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setVolume(volume === 0 ? 0.5 : 0)} size="small">
          {getVolumeIcon()}
        </IconButton>
        
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
          min={0}
          max={1}
          step={0.01}
          size="small"
          sx={{ mx: 1, width: 100 }}
        />
      </Box>
    </Box>
  );
}

export default AudioPlayer;