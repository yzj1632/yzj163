import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerState, GamePhase, Rarity, Item, Fish, Location } from './types';
import { LOCATIONS, RODS, BAITS, LOOT_TABLE } from './constants';
import Bobber from './components/Bobber';
import FishingRod from './components/FishingRod';
import InventoryModal from './components/InventoryModal';
import JournalModal from './components/JournalModal';
import GearSelector from './components/GearSelector';
import { Backpack, Book, Settings, MapPin, Anchor } from 'lucide-react';

// Initial state
const INITIAL_STATE: PlayerState = {
  gold: 0,
  inventory: { 'worm': 10 },
  collection: [],
  equippedRodId: 'bamboo',
  equippedBaitId: 'worm',
  ownedRods: ['bamboo'],
  level: 1,
  xp: 0
};

export default function App() {
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_STATE);
  const [gamePhase, setGamePhase] = useState<GamePhase>('IDLE');
  const [location, setLocation] = useState<Location>(LOCATIONS[0]);
  const [lastCatch, setLastCatch] = useState<{ item: Item | Fish; timing: string } | null>(null);
  
  // Modals
  const [showInventory, setShowInventory] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showGear, setShowGear] = useState(false);

  // Timers and Refs
  const waitTimerRef = useRef<number | null>(null);
  const hookTimeRef = useRef<number>(0);

  // Sound placeholders (No actual audio files, visual only for this demo)
  const playSound = (type: 'cast' | 'splash' | 'success' | 'fail') => {
    // console.log(`Playing sound: ${type}`);
  };

  // --- Game Loop Logic ---

  const handleCast = () => {
    if (playerState.inventory[playerState.equippedBaitId] <= 0) {
      alert("没有鱼饵了！请在装备菜单购买。");
      setShowGear(true);
      return;
    }

    setGamePhase('CASTING');
    playSound('cast');
    setLastCatch(null);

    // Consume bait
    setPlayerState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [prev.equippedBaitId]: prev.inventory[prev.equippedBaitId] - 1
      }
    }));

    // Transition to Waiting after animation
    setTimeout(() => {
      setGamePhase('WAITING');
      startWaitTimer();
    }, 1000);
  };

  const startWaitTimer = () => {
    const rod = RODS.find(r => r.id === playerState.equippedRodId);
    
    // Base time 3-10s
    let waitTime = 3000 + Math.random() * 7000;
    
    // Rod modifier
    if (rod?.perks.timeReduction) {
        waitTime = Math.max(2000, waitTime - (rod.perks.timeReduction * 1000));
    }

    waitTimerRef.current = setTimeout(() => {
      setGamePhase('HOOKED');
      playSound('splash');
      hookTimeRef.current = Date.now();
      
      // Auto-fail if not clicked within 3 seconds
      waitTimerRef.current = setTimeout(() => {
        if (gamePhase !== 'RESULT') { // Check if user hasn't already clicked
             handleReelIn(true); // Force fail
        }
      }, 3000); 

    }, waitTime);
  };

  const calculateLoot = (timing: 'Perfect' | 'Good' | 'Late') => {
    const rod = RODS.find(r => r.id === playerState.equippedRodId);
    const bait = BAITS.find(b => b.id === playerState.equippedBaitId);
    
    let trashChance = 0.20;
    let rareChance = 0.25;
    let epicChance = 0.10;
    let treasureChance = 0.05;

    // Apply Modifiers
    if (rod?.perks.trashReduction) trashChance -= rod.perks.trashReduction;
    if (rod?.perks.rareBonus) rareChance += rod.perks.rareBonus;
    if (bait?.perks.rareBonus) rareChance += bait.perks.rareBonus;
    if (bait?.perks.trashBonus) trashChance += bait.perks.trashBonus;
    if (timing === 'Perfect') rareChance += 0.05;

    const roll = Math.random();
    let rarity: Rarity = 'common';

    if (roll < treasureChance) rarity = 'treasure';
    else if (roll < treasureChance + epicChance) rarity = 'epic';
    else if (roll < treasureChance + epicChance + rareChance) rarity = 'rare';
    else if (roll > (1 - trashChance)) rarity = 'trash';

    // Filter Loot Table by Rarity and Environment
    let pool = LOOT_TABLE.filter(item => {
        if (item.rarity !== rarity) return false;
        if ('environment' in item && item.environment !== 'all' && item.environment !== location.type) return false;
        return true;
    });

    // Fallback if pool is empty (e.g., no epic fish in this zone)
    if (pool.length === 0) {
        pool = LOOT_TABLE.filter(i => i.rarity === 'common');
    }

    const caughtItem = pool[Math.floor(Math.random() * pool.length)];
    return caughtItem;
  };

  const handleReelIn = (autoFail = false) => {
    if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    
    const reactionTime = Date.now() - hookTimeRef.current;
    let timingResult: 'Perfect' | 'Good' | 'Late' | 'Miss' = 'Miss';

    if (autoFail) {
      timingResult = 'Miss';
    } else if (reactionTime < 600) {
      timingResult = 'Perfect';
    } else if (reactionTime < 2000) {
      timingResult = 'Good';
    } else {
      timingResult = 'Late';
    }

    // 50% escape chance if Late
    if (timingResult === 'Late' && Math.random() > 0.5) {
        timingResult = 'Miss';
    }

    if (timingResult === 'Miss') {
       playSound('fail');
       setLastCatch(null); // Indicates fail
    } else {
       playSound('success');
       const loot = calculateLoot(timingResult);
       setLastCatch({ item: loot, timing: timingResult });
       
       // Update State
       setPlayerState(prev => {
           const newInventory = { ...prev.inventory };
           newInventory[loot.id] = (newInventory[loot.id] || 0) + 1;
           
           const newCollection = prev.collection.includes(loot.id) 
             ? prev.collection 
             : [...prev.collection, loot.id];
           
           return {
               ...prev,
               inventory: newInventory,
               collection: newCollection
           };
       });
    }

    setGamePhase('RESULT');
  };

  const closeResult = () => {
    setGamePhase('IDLE');
  };

  // --- Handlers for Gear Menu ---

  const handleBuy = (type: 'rod' | 'bait', id: string) => {
      const item = type === 'rod' ? RODS.find(r => r.id === id) : BAITS.find(b => b.id === id);
      if (!item) return;
      if (playerState.gold < item.price) return;

      setPlayerState(prev => {
          let newGold = prev.gold - item.price;
          let newOwnedRods = prev.ownedRods;
          let newInventory = { ...prev.inventory };

          if (type === 'rod') {
              newOwnedRods = [...prev.ownedRods, id];
          } else {
              newInventory[id] = (newInventory[id] || 0) + 1;
          }

          return {
              ...prev,
              gold: newGold,
              ownedRods: newOwnedRods,
              inventory: newInventory
          };
      });
  };

  const handleEquip = (type: 'rod' | 'bait', id: string) => {
      setPlayerState(prev => ({
          ...prev,
          [type === 'rod' ? 'equippedRodId' : 'equippedBaitId']: id
      }));
  };
  
  // Dev cheat for testing
  useEffect(() => {
     // Give some starter gold for testing mechanics
     if (playerState.gold === 0 && playerState.inventory.worm === 10) {
         setPlayerState(p => ({...p, gold: 100})); 
     }
  }, []);

  // --- UI Components ---

  const activeLocation = location;
  const showRod = gamePhase === 'WAITING' || gamePhase === 'HOOKED' || gamePhase === 'CASTING';

  return (
    <div className={`h-screen w-screen relative flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b ${activeLocation.bgGradient}`}>
      
      {/* Background Ambience Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      {/* Fishing Rod Overlay */}
      {showRod && <FishingRod />}

      {/* Top Bar */}
      <div className="w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-4">
            <button onClick={() => setShowInventory(true)} className="flex flex-col items-center text-white hover:text-yellow-400 transition">
                <div className="bg-slate-800 p-2 rounded-full border border-slate-600">
                    <Backpack size={24} />
                </div>
                <span className="text-xs font-bold mt-1 bg-black/50 px-2 rounded">背包</span>
            </button>
            <button onClick={() => setShowJournal(true)} className="flex flex-col items-center text-white hover:text-yellow-400 transition">
                <div className="bg-slate-800 p-2 rounded-full border border-slate-600">
                    <Book size={24} />
                </div>
                <span className="text-xs font-bold mt-1 bg-black/50 px-2 rounded">图鉴</span>
            </button>
        </div>
        
        <div className="flex flex-col items-end">
             <h1 className="text-2xl font-fantasy text-yellow-500 text-shadow-lg">{activeLocation.name}</h1>
             <div className="text-xs text-gray-300 max-w-[200px] text-right">{activeLocation.description}</div>
             
             {/* Location Switcher */}
             <div className="flex gap-2 mt-2">
                 {LOCATIONS.map(loc => (
                     <button 
                        key={loc.id}
                        onClick={() => {
                             if(gamePhase === 'IDLE') setLocation(loc);
                        }}
                        className={`w-3 h-3 rounded-full ${location.id === loc.id ? 'bg-yellow-500' : 'bg-gray-600'}`}
                        title={loc.name}
                     />
                 ))}
             </div>
        </div>
      </div>

      {/* Main Gameplay Area */}
      <div className="relative flex-1 w-full flex items-center justify-center">
          
          {/* Water Surface Line */}
          <div className="absolute top-[60%] w-full h-[40%] bg-blue-500/10 backdrop-blur-sm border-t border-blue-400/30"></div>

          {/* Bobber */}
          <div className="relative w-full max-w-lg h-64 z-10">
              <Bobber phase={gamePhase} />
          </div>

          {/* Action Button - Big and Sticky */}
          <div className="absolute bottom-32 z-30">
              {gamePhase === 'IDLE' && (
                  <button 
                    onClick={handleCast}
                    className="group bg-red-600 hover:bg-red-500 text-white p-6 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border-4 border-red-800 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                    title="抛竿"
                  >
                     <div className="relative w-10 h-10">
                         {/* Styled Hook Icon using SVG */}
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full transform group-hover:-translate-y-1 transition-transform">
                             <path d="M18 13v-1a5 5 0 0 0-5-5h-2a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h4" />
                             <path d="M18 13l-3-3" />
                             <path d="M18 13l-3 3" />
                         </svg>
                     </div>
                  </button>
              )}
               {gamePhase === 'WAITING' && (
                  <div className="text-white font-fantasy text-lg animate-pulse bg-black/30 px-4 py-1 rounded backdrop-blur-sm">
                      等待中...
                  </div>
              )}
              {gamePhase === 'HOOKED' && (
                  <button 
                    onClick={() => handleReelIn(false)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-2xl py-4 px-16 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.8)] border-4 border-white animate-bounce"
                  >
                    收 杆!
                  </button>
              )}
          </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="w-full bg-slate-900 border-t border-slate-700 p-4 z-20 flex justify-between items-center pb-8">
          
          {/* Current Gear */}
          <div 
             className="flex items-center gap-4 cursor-pointer hover:bg-slate-800 p-2 rounded transition"
             onClick={() => setShowGear(true)}
          >
              <div className="flex flex-col">
                  <span className="text-xs text-gray-400">装备鱼竿</span>
                  <span className="font-bold text-blue-300">{RODS.find(r => r.id === playerState.equippedRodId)?.name}</span>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div className="flex flex-col">
                  <span className="text-xs text-gray-400">当前鱼饵 ({playerState.inventory[playerState.equippedBaitId] || 0})</span>
                  <span className="font-bold text-green-300">{BAITS.find(b => b.id === playerState.equippedBaitId)?.name}</span>
              </div>
              <Settings size={18} className="text-gray-500" />
          </div>

          {/* Gold */}
          <div className="bg-black/40 px-4 py-2 rounded border border-yellow-900 text-yellow-500 font-mono font-bold">
              {playerState.gold} G
          </div>
      </div>

      {/* Result Modal Overlay */}
      {gamePhase === 'RESULT' && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={closeResult}>
             <div className="bg-slate-900 border-2 border-yellow-600 p-8 rounded-lg shadow-2xl flex flex-col items-center max-w-sm w-full animate-[splash_0.3s_ease-out]">
                 {lastCatch ? (
                     <>
                        <div className="text-yellow-500 text-lg font-bold mb-2 tracking-widest uppercase">{lastCatch.timing} Catch!</div>
                        <div className="text-6xl mb-4 p-4 bg-slate-800 rounded-full border-4 border-slate-700 shadow-inner">
                            {lastCatch.item.icon}
                        </div>
                        <h2 className={`text-2xl font-bold mb-1 ${
                            lastCatch.item.rarity === 'epic' ? 'text-purple-400' :
                            lastCatch.item.rarity === 'rare' ? 'text-blue-400' :
                            lastCatch.item.rarity === 'trash' ? 'text-gray-400' : 
                            'text-white'
                        }`}>
                            {lastCatch.item.name}
                        </h2>
                        <p className="text-gray-400 text-center italic mb-4 text-sm">
                            {lastCatch.item.description}
                        </p>
                        <div className="flex gap-2">
                             <span className="px-3 py-1 bg-slate-800 rounded text-yellow-500 text-sm">+{lastCatch.item.value} G 价值</span>
                        </div>
                     </>
                 ) : (
                     <>
                        <div className="text-6xl mb-4 text-gray-600">💨</div>
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">鱼溜走了...</h2>
                        <p className="text-gray-500 text-sm">下次动作快点！</p>
                     </>
                 )}
                 <div className="mt-8 text-xs text-gray-600">点击任意处继续</div>
             </div>
          </div>
      )}

      <InventoryModal 
        isOpen={showInventory} 
        onClose={() => setShowInventory(false)} 
        inventory={playerState.inventory} 
        gold={playerState.gold}
      />
      
      <JournalModal 
        isOpen={showJournal} 
        onClose={() => setShowJournal(false)} 
        collection={playerState.collection} 
      />

      <GearSelector 
        isOpen={showGear}
        onClose={() => setShowGear(false)}
        playerState={playerState}
        onEquipRod={(id) => handleEquip('rod', id)}
        onEquipBait={(id) => handleEquip('bait', id)}
        onBuy={handleBuy}
      />

    </div>
  );
}