import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-digital screen-tear">
      {/* Static Noise Overlay */}
      <div className="static-noise"></div>

      {/* Background decorative elements - Jarring Cyan/Magenta */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff00ff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00ffff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-20" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }}></div>

      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between relative z-10 border-b-4 border-[#ff00ff] neon-border-pink bg-black/50">
        <div className="flex items-center gap-4">
          <Terminal size={40} className="text-[#00ffff] animate-pulse" />
          <h1 className="text-5xl font-black tracking-widest uppercase glitch-effect neon-text-cyan" data-text="MAINFRAME_ACCESS">
            MAINFRAME_ACCESS
          </h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[#ff00ff] text-xl animate-pulse">STATUS: COMPROMISED</p>
          <p className="text-[#00ffff] text-sm">PROTOCOL: SNAKE_EXEC</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-7xl mx-auto gap-8 lg:flex-row lg:items-stretch">
        
        {/* Game Section */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <div className="absolute inset-0 border-2 border-[#ff00ff]/30 border-dashed pointer-events-none m-4"></div>
          <SnakeGame />
        </div>

        {/* Sidebar / Music Player Section */}
        <div className="w-full lg:w-[450px] flex flex-col justify-center gap-6">
          <div className="bg-black border-4 border-[#00ffff] neon-border-cyan p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffff] animate-pulse"></div>
            <h2 className="text-3xl font-bold mb-6 text-[#ff00ff] uppercase tracking-widest glitch-effect" data-text="SONIC_TELEMETRY">SONIC_TELEMETRY</h2>
            <MusicPlayer />
          </div>
          
          <div className="bg-black border-4 border-[#ff00ff] neon-border-pink p-6 text-xl text-[#00ffff] font-digital relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] animate-pulse"></div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-2xl glitch-effect" data-text="KINETIC_OVERRIDE">KINETIC_OVERRIDE</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-[#00ffff]/30 pb-2">
                <span>[DIRECTIONAL_OVERRIDE]</span> 
                <span className="text-[#ff00ff] font-bold bg-[#ff00ff]/20 px-2 py-1">WASD / ARROWS</span>
              </li>
              <li className="flex justify-between items-center border-b border-[#00ffff]/30 pb-2">
                <span>[HALT_EXECUTION]</span> 
                <span className="text-[#ff00ff] font-bold bg-[#ff00ff]/20 px-2 py-1">SPACEBAR</span>
              </li>
              <li className="flex justify-between items-center">
                <span>[AUDIO_CONTROL]</span> 
                <span className="text-[#ff00ff] font-bold bg-[#ff00ff]/20 px-2 py-1">MODULE_ABOVE</span>
              </li>
            </ul>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-[#00ffff] text-lg font-digital relative z-10 border-t-2 border-[#00ffff] bg-black/80">
        &gt; END_OF_LINE // TERMINAL_ID: {Math.floor(Math.random() * 9999).toString().padStart(4, '0')} // CONNECTION: UNSTABLE
      </footer>
    </div>
  );
}
