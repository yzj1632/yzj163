import React from 'react';

const FishingRod: React.FC = () => {
  // Coordinates for the rod tip and the screen center (target)
  // We use percentages to ensure it looks good on most screens
  const rodTipX = "75%";
  const rodTipY = "65%";
  const targetX = "50%";
  const targetY = "50%";

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <svg className="w-full h-full drop-shadow-xl">
        {/* Fishing Line: Connects rod tip to the bobber at center screen */}
        <line 
          x1={rodTipX} 
          y1={rodTipY} 
          x2={targetX} 
          y2={targetY} 
          stroke="rgba(200, 220, 255, 0.6)" 
          strokeWidth="1.5"
          className="drop-shadow-sm"
        />
        
        {/* The Rod: Angled from bottom right */}
        {/* Main Shaft */}
        <line 
          x1="120%" 
          y1="120%" 
          x2={rodTipX} 
          y2={rodTipY} 
          stroke="#5D4037" 
          strokeWidth="12" 
          strokeLinecap="round"
        />
        
        {/* Rod Details / Highlights */}
        <line 
          x1="115%" 
          y1="115%" 
          x2="78%" 
          y2="68%" 
          stroke="#8D6E63" 
          strokeWidth="4" 
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Eyelet at tip */}
        <circle cx={rodTipX} cy={rodTipY} r="4" fill="none" stroke="#silver" strokeWidth="2" />
        <circle cx={rodTipX} cy={rodTipY} r="2" fill="#333" />
      </svg>
    </div>
  );
};

export default FishingRod;