/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020202] text-[#00FFFF] flex flex-col relative overflow-hidden font-sans selection:bg-[#FF00FF] selection:text-[#00FFFF]">
      {/* Glitch Overlays */}
      <div className="absolute inset-0 noise-bg z-50 mix-blend-overlay" />
      <div className="absolute inset-0 scanlines z-40" />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 gap-8 tear-effect">
        
        <div className="text-center mb-4">
          <h1 
            className="text-5xl md:text-7xl font-black tracking-tighter text-[#00FFFF] glitch-text drop-shadow-[4px_4px_0px_#FF00FF]"
            data-text="SYS.SNAKE_PROTOCOL"
          >
            SYS.SNAKE_PROTOCOL
          </h1>
          <p className="text-[#FF00FF] mt-2 tracking-widest uppercase text-xl font-bold bg-[#00FFFF]/10 px-2 py-1 inline-block border border-[#FF00FF]">
            STATUS: AWAITING_INPUT // AUDIO_SYNC: ACTIVE
          </p>
        </div>

        <SnakeGame />
        
        <div className="w-full max-w-md mt-4">
          <MusicPlayer />
        </div>

      </main>
    </div>
  );
}
