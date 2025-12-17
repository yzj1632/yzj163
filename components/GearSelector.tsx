import React from 'react';
import { RODS, BAITS } from '../constants';
import { PlayerState } from '../types';
import { X, ShoppingBag, Anchor } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  playerState: PlayerState;
  onEquipRod: (id: string) => void;
  onEquipBait: (id: string) => void;
  onBuy: (type: 'rod' | 'bait', id: string) => void;
}

const GearSelector: React.FC<Props> = ({ 
  isOpen, onClose, playerState, onEquipRod, onEquipBait, onBuy 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-blue-900 rounded-lg w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="p-4 flex justify-between items-center bg-blue-950 border-b border-blue-800">
          <h2 className="text-xl font-fantasy text-blue-200">装备整备</h2>
          <button onClick={onClose}><X className="text-blue-300" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Rods Section */}
            <div>
                <h3 className="flex items-center gap-2 text-lg text-yellow-500 font-bold mb-4 border-b border-slate-700 pb-2">
                    <Anchor size={20} /> 鱼竿
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {RODS.map(rod => {
                        const owned = playerState.ownedRods.includes(rod.id);
                        const equipped = playerState.equippedRodId === rod.id;
                        
                        return (
                            <div key={rod.id} className={`p-4 rounded border flex flex-col justify-between ${equipped ? 'bg-blue-900/30 border-yellow-500 ring-1 ring-yellow-500' : 'bg-slate-800 border-slate-700'}`}>
                                <div>
                                    <div className="font-bold text-gray-200">{rod.name}</div>
                                    <div className="text-xs text-gray-400 mt-1 h-10">{rod.description}</div>
                                    <div className="text-xs text-green-400 mt-2">
                                        {rod.perks.trashReduction && `• 垃圾减少 ${rod.perks.trashReduction * 100}%`}
                                        {rod.perks.rareBonus && `• 稀有率 +${rod.perks.rareBonus * 100}%`}
                                        {rod.perks.timeReduction && `• 等待减少 ${rod.perks.timeReduction}秒`}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {owned ? (
                                        <button 
                                            onClick={() => onEquipRod(rod.id)}
                                            disabled={equipped}
                                            className={`w-full py-1 text-sm font-bold rounded ${equipped ? 'bg-green-600 text-white cursor-default' : 'bg-slate-600 hover:bg-slate-500 text-white'}`}
                                        >
                                            {equipped ? '已装备' : '装备'}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => onBuy('rod', rod.id)}
                                            disabled={playerState.gold < rod.price}
                                            className={`w-full py-1 text-sm font-bold rounded flex justify-center items-center gap-1 ${playerState.gold >= rod.price ? 'bg-yellow-700 hover:bg-yellow-600 text-white' : 'bg-slate-700 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            <ShoppingBag size={14} /> {rod.price} G
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Baits Section */}
            <div>
                <h3 className="flex items-center gap-2 text-lg text-yellow-500 font-bold mb-4 border-b border-slate-700 pb-2">
                    <span className="text-xl">🪱</span> 鱼饵
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {BAITS.map(bait => {
                        const count = playerState.inventory[bait.id] || 0;
                        const equipped = playerState.equippedBaitId === bait.id;
                        
                        return (
                            <div key={bait.id} className={`p-4 rounded border flex flex-col justify-between ${equipped ? 'bg-blue-900/30 border-yellow-500' : 'bg-slate-800 border-slate-700'}`}>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-gray-200">{bait.name}</div>
                                        <div className="text-xs bg-slate-900 px-2 py-1 rounded text-gray-300">x{count}</div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 h-8">{bait.description}</div>
                                    <div className="text-xs text-green-400 mt-2 h-4">
                                        {bait.perks.saltwaterBonus && `海水鱼 +${bait.perks.saltwaterBonus*100}%`}
                                        {bait.perks.rareBonus && `稀有 +${bait.perks.rareBonus*100}%`}
                                        {bait.perks.trashBonus && `奇怪的东西 +${bait.perks.trashBonus*100}%`}
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                     <button 
                                        onClick={() => onEquipBait(bait.id)}
                                        disabled={equipped || count === 0}
                                        className={`flex-1 py-1 text-xs font-bold rounded ${equipped ? 'bg-green-600 text-white' : count > 0 ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-700 text-gray-600'}`}
                                    >
                                        {equipped ? '使用中' : '装备'}
                                    </button>
                                    <button 
                                        onClick={() => onBuy('bait', bait.id)}
                                        disabled={playerState.gold < bait.price}
                                        className={`px-3 py-1 text-xs font-bold rounded flex items-center ${playerState.gold >= bait.price ? 'bg-yellow-700 hover:bg-yellow-600' : 'bg-slate-700 text-gray-500'}`}
                                    >
                                        {bait.price} G
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default GearSelector;
