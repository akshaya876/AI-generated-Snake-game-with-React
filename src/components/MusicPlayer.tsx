import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "SECTOR_1_CORRUPTION", artist: "AI_NODE_01", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "MEMORY_LEAK_DETECTED", artist: "AI_NODE_02", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "SYSTEM_OVERRIDE", artist: "AI_NODE_03", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full bg-[#050505] border-4 border-[#FF00FF] p-4 shadow-[8px_8px_0px_#00FFFF] relative">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="absolute top-0 right-0 bg-[#FF00FF] text-[#050505] px-2 py-1 text-sm font-bold">
        AUDIO_SUBSYSTEM_V1.0
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between items-end border-b-2 border-[#00FFFF] pb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[#00FFFF] text-2xl font-bold truncate uppercase glitch-text" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
            <p className="text-[#FF00FF] text-lg truncate">
              SRC: {currentTrack.artist}
            </p>
          </div>
          <div className="text-[#00FFFF] text-xl animate-pulse">
            {isPlaying ? '[ACTIVE]' : '[HALTED]'}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={playPrev}
            className="px-4 py-2 bg-[#050505] text-[#FF00FF] border-2 border-[#FF00FF] hover:bg-[#FF00FF] hover:text-[#050505] transition-colors font-bold text-xl"
          >
            &lt;&lt; PRV
          </button>
          
          <button 
            onClick={togglePlay}
            className="flex-1 px-4 py-2 bg-[#00FFFF] text-[#050505] border-2 border-[#00FFFF] hover:bg-[#050505] hover:text-[#00FFFF] transition-colors font-bold text-2xl uppercase"
          >
            {isPlaying ? 'HALT_EXECUTION' : 'EXECUTE_AUDIO'}
          </button>
          
          <button 
            onClick={playNext}
            className="px-4 py-2 bg-[#050505] text-[#FF00FF] border-2 border-[#FF00FF] hover:bg-[#FF00FF] hover:text-[#050505] transition-colors font-bold text-xl"
          >
            NXT &gt;&gt;
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[#00FFFF] text-lg">VOL:</div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-4 bg-[#050505] border-2 border-[#FF00FF] appearance-none cursor-pointer accent-[#00FFFF]"
          />
        </div>

        <div 
          className="w-full h-6 bg-[#050505] border-2 border-[#00FFFF] cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#FF00FF]"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[#050505] font-bold text-sm mix-blend-difference pointer-events-none">
            DATA_STREAM_PROGRESS: {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
