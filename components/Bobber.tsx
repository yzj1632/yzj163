import React from 'react';
import { GamePhase } from '../types';

interface BobberProps {
  phase: GamePhase;
}

const Bobber: React.FC<BobberProps> = ({ phase }) => {
  if (phase === 'IDLE' || phase === 'RESULT') return null;
  if (phase === 'CASTING') return null; // Logic handled by main animation delay usually

  const isHooked = phase === 'HOOKED';
  const isWaiting = phase === 'WAITING';

  // Base visuals
  let bobberVisual = (
    <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg z-20 relative bg-red-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-30 rounded-t-full"></div>
        <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-gray-800 transform -translate-x-1/2"></div>
        <div className="absolute -top-8 left-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-x-1/2 border border-black"></div>
    </div>
  );

  // Apply animations wrapper
  // We separate float (y-axis) and nibble (shake/rotate) to avoid transform conflicts
  const animationWrapper = (
    <div className={`${isWaiting ? 'animate-float' : ''} ${isHooked ? '' : 'transition-transform duration-200'}`}>
        <div className={`${isWaiting ? 'animate-nibble' : ''} ${isHooked ? 'animate-splash' : ''}`}>
             {bobberVisual}
        </div>
    </div>
  );

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
      
      {/* Physics-based Ripples - Only show when in water */}
      {(isWaiting || isHooked) && (
         <div className="absolute inset-0 flex items-center justify-center -z-10">
            {/* Multiple staggered ripples for realistic wave propagation */}
            <div className="w-24 h-8 border-[3px] border-white/20 rounded-[100%] absolute animate-ripple" style={{animationDelay: '0s'}}></div>
            <div className="w-24 h-8 border-[3px] border-white/20 rounded-[100%] absolute animate-ripple" style={{animationDelay: '0.8s'}}></div>
            <div className="w-24 h-8 border-[3px] border-white/20 rounded-[100%] absolute animate-ripple" style={{animationDelay: '1.6s'}}></div>
         </div>
      )}

      <div className={`relative transition-transform duration-100`}>
        {/* Splash Particles (Only when hooked) */}
        {isHooked && (
           <>
            <div className="absolute -left-6 -top-4 w-3 h-3 bg-blue-100 rounded-full animate-ping"></div>
            <div className="absolute left-6 -top-6 w-4 h-4 bg-white rounded-full animate-ping delay-75"></div>
            <div className="absolute left-0 -top-8 w-2 h-2 bg-blue-200 rounded-full animate-ping delay-150"></div>
           </>
        )}
        
        {/* The Bobber */}
        {animationWrapper}
        
        {/* Static Shadow/Reflection on water */}
        <div className="absolute -bottom-3 left-1/2 w-10 h-3 bg-black opacity-20 rounded-[100%] transform -translate-x-1/2 blur-sm"></div>
      </div>
    </div>
  );
};

export default Bobber;