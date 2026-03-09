import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "DATA_CORRUPTION_01.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "NEURAL_FEEDBACK_LOOP.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "SYNTHETIC_NIGHTMARE.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full flex flex-col items-center font-digital">
      <div className="w-full flex items-center justify-between mb-8 border-b-2 border-[#ff00ff] pb-4">
        <div className="flex items-center gap-4">
          <div className="p-2 border-2 border-[#00ffff] bg-black text-[#00ffff] animate-[spin_4s_linear_infinite]">
            <Disc3 size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#ff00ff] uppercase tracking-widest mb-1 glitch-effect" data-text="STREAM_ACTIVE">STREAM_ACTIVE</h3>
            <p className="text-2xl text-white truncate w-48 sm:w-64 bg-[#00ffff]/20 px-2">{TRACKS[currentTrackIndex].title}</p>
          </div>
        </div>
        <div className="flex gap-1">
            {isPlaying ? (
              <div className="flex items-end gap-1 h-10">
                <div className="w-3 bg-[#00ffff] animate-[bounce_0.5s_infinite] neon-bg-cyan"></div>
                <div className="w-3 bg-[#ff00ff] animate-[bounce_0.7s_infinite_0.1s] neon-bg-pink"></div>
                <div className="w-3 bg-[#00ffff] animate-[bounce_0.4s_infinite_0.2s] neon-bg-cyan"></div>
                <div className="w-3 bg-[#ff00ff] animate-[bounce_0.6s_infinite_0.3s] neon-bg-pink"></div>
              </div>
            ) : (
               <div className="text-[#ff00ff] text-xl animate-pulse">IDLE</div>
            )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 w-full bg-[#00ffff]/10 py-4 border-y-2 border-[#00ffff]">
        <button onClick={prevTrack} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors hover:scale-110">
          <SkipBack size={40} />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-20 h-20 flex items-center justify-center bg-black border-4 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all neon-border-pink"
        >
          {isPlaying ? <Pause size={40} className="fill-current" /> : <Play size={40} className="fill-current ml-2" />}
        </button>
        <button onClick={nextTrack} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors hover:scale-110">
          <SkipForward size={40} />
        </button>
      </div>

      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrackIndex].url} 
        onEnded={handleEnded}
        loop={false}
      />
    </div>
  );
}
