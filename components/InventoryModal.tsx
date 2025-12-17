import React from 'react';
import { Item, Fish, Rarity, PlayerState } from '../types';
import { LOOT_TABLE } from '../constants';
import { X, Coins } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inventory: PlayerState['inventory'];
  gold: number;
}

const rarityColor = (rarity: Rarity) => {
  switch (rarity) {
    case 'trash': return 'text-gray-400';
    case 'common': return 'text-white';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'treasure': return 'text-orange-400';
    default: return 'text-white';
  }
};

const InventoryModal: React.FC<Props> = ({ isOpen, onClose, inventory, gold }) => {
  if (!isOpen) return null;

  const inventoryItems = Object.entries(inventory).map(([id, count]) => {
    const meta = LOOT_TABLE.find(i => i.id === id);
    if (!meta) return null;
    return { ...meta, count };
  }).filter((item): item is (Fish | Item) & { count: number } => {
    return item !== null && item.count > 0;
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-yellow-700 rounded-lg w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-yellow-700/50 flex justify-between items-center bg-slate-950/50">
          <h2 className="text-xl font-fantasy text-yellow-500 tracking-wider">行囊</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Currency */}
        <div className="px-4 py-2 bg-slate-800 flex items-center gap-2 border-b border-gray-700">
          <Coins className="text-yellow-400" size={18} />
          <span className="text-yellow-100 font-mono">{gold}</span>
        </div>

        {/* Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-3">
          {inventoryItems.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500 italic">
              背包空空如也...去钓点什么吧！
            </div>
          ) : (
            inventoryItems.map((item) => (
              <div key={item.id} className="group relative bg-slate-800 border border-slate-600 rounded p-2 flex flex-col items-center hover:border-yellow-500 transition-colors cursor-help">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-slate-900">
                  {item.count}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black/95 border border-gray-600 p-2 rounded hidden group-hover:block z-50 pointer-events-none">
                  <div className={`font-bold text-sm ${rarityColor(item.rarity as Rarity)}`}>{item.name}</div>
                  <div className="text-xs text-gray-400 italic mb-1">{item.description}</div>
                  <div className="text-xs text-yellow-500">售价: {item.value} 金币</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;