import React from 'react';
import { LOOT_TABLE } from '../constants';
import { Rarity } from '../types';
import { X, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  collection: string[];
}

const JournalModal: React.FC<Props> = ({ isOpen, onClose, collection }) => {
  if (!isOpen) return null;

  const allFish = LOOT_TABLE.filter(i => (i as any).type === 'fish');

  const rarityBg = (rarity: Rarity) => {
      switch(rarity) {
          case 'rare': return 'bg-blue-900/20 border-blue-800';
          case 'epic': return 'bg-purple-900/20 border-purple-800';
          default: return 'bg-slate-800 border-slate-700';
      }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1614] border-2 border-[#8b7355] rounded-lg w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#8b7355]/50 flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#8b7355]" />
            <h2 className="text-xl font-fantasy text-[#dcdcdc] tracking-wider">垂钓日志</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
          {allFish.map((fish) => {
            const isCaught = collection.includes(fish.id);
            return (
              <div 
                key={fish.id} 
                className={`flex items-center gap-4 p-3 rounded border ${isCaught ? rarityBg(fish.rarity) : 'bg-slate-900/50 border-slate-800 grayscale opacity-60'}`}
              >
                <div className="text-4xl bg-black/30 p-2 rounded">{fish.icon}</div>
                <div className="flex-1">
                  <div className={`font-bold font-fantasy ${isCaught ? 'text-gray-200' : 'text-gray-500'}`}>
                    {isCaught ? fish.name : '???'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isCaught ? fish.description : '尚未发现该物种'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress */}
        <div className="p-4 border-t border-[#8b7355]/30 bg-[#120f0e] text-center text-gray-400 text-sm">
            进度: {collection.length} / {allFish.length}
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
