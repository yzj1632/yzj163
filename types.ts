export type Rarity = 'common' | 'rare' | 'epic' | 'trash' | 'treasure';

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  value: number; // Gold value
  icon: string; // Emoji or Lucide icon name
}

export interface Fish extends Item {
  type: 'fish';
  environment: 'freshwater' | 'saltwater' | 'lava' | 'all';
}

export interface Rod {
  id: string;
  name: string;
  description: string;
  price: number;
  perks: {
    trashReduction?: number; // percentage
    rareBonus?: number; // percentage
    timeReduction?: number; // seconds
  };
}

export interface Bait {
  id: string;
  name: string;
  description: string;
  price: number;
  perks: {
    saltwaterBonus?: number;
    rareBonus?: number;
    trashBonus?: number; // For "Corrupted Meat"
  };
  quantity: number;
}

export interface PlayerState {
  gold: number;
  inventory: { [itemId: string]: number };
  collection: string[]; // IDs of caught fish
  equippedRodId: string;
  equippedBaitId: string;
  ownedRods: string[];
  level: number;
  xp: number;
}

export type GamePhase = 'IDLE' | 'CASTING' | 'WAITING' | 'HOOKED' | 'REELING' | 'RESULT';

export interface Location {
  id: string;
  name: string;
  type: 'freshwater' | 'saltwater' | 'lava';
  description: string;
  bgGradient: string;
}
