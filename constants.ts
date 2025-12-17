import { Rod, Bait, Fish, Location, Item } from './types';

export const LOCATIONS: Location[] = [
  {
    id: 'elwynn',
    name: '艾尔文河畔',
    type: 'freshwater',
    description: '宁静的森林河流，适合新手。',
    bgGradient: 'from-green-900 to-blue-900',
  },
  {
    id: 'stranglethorn',
    name: '荆棘谷海角',
    type: 'saltwater',
    description: '热带海岸，充满危险与机遇。',
    bgGradient: 'from-blue-600 to-cyan-800',
  },
  {
    id: 'burning_steppes',
    name: '燃烧平原',
    type: 'lava',
    description: '灼热的岩浆池，只有大师才能垂钓。',
    bgGradient: 'from-red-900 to-orange-800',
  },
];

export const RODS: Rod[] = [
  {
    id: 'bamboo',
    name: '新手竹竿',
    description: '一根简单的竹子，勉强能用。',
    price: 0,
    perks: {},
  },
  {
    id: 'carbon',
    name: '强化碳纤维竿',
    description: '坚固耐用，很难钓到垃圾。',
    price: 500,
    perks: { trashReduction: 0.10 },
  },
  {
    id: 'mithril',
    name: '秘银附魔竿',
    description: '闪烁着魔法光辉，鱼儿无法抗拒。',
    price: 2000,
    perks: { rareBonus: 0.15, timeReduction: 1 },
  },
];

export const BAITS: Bait[] = [
  {
    id: 'worm',
    name: '通用饵',
    description: '普通的蚯蚓。',
    price: 5,
    quantity: 99,
    perks: {},
  },
  {
    id: 'shrimp',
    name: '亮鳞虾',
    description: '深受海水鱼喜爱的美味。',
    price: 20,
    quantity: 0,
    perks: { saltwaterBonus: 0.15 },
  },
  {
    id: 'glowworm',
    name: '发光虫',
    description: '在黑暗中发光，吸引稀有生物。',
    price: 50,
    quantity: 0,
    perks: { rareBonus: 0.10 },
  },
  {
    id: 'meat',
    name: '腐臭肉块',
    description: '散发着怪味，可能引来奇怪的东西。',
    price: 15,
    quantity: 0,
    perks: { trashBonus: 0.20 }, // Also increases treasure chance technically via specific loot logic
  },
];

export const LOOT_TABLE: (Fish | Item)[] = [
  // Common
  { id: 'catfish', name: '滑皮鲶鱼', description: '虽然丑，但肉质鲜美。', rarity: 'common', value: 5, icon: '🐟', type: 'fish', environment: 'freshwater' },
  { id: 'cod', name: '斑点鳕鱼', description: '常见的海鱼。', rarity: 'common', value: 6, icon: '🐟', type: 'fish', environment: 'saltwater' },
  { id: 'sunfish', name: '太阳鱼', description: '鳞片像阳光一样闪耀。', rarity: 'common', value: 8, icon: '🐠', type: 'fish', environment: 'all' },
  
  // Rare
  { id: 'goldscale', name: '金脊鱼', description: '可以用来烹饪高级料理。', rarity: 'rare', value: 25, icon: '🐡', type: 'fish', environment: 'freshwater' },
  { id: 'spinefish', name: '刺鳃鲑鱼', description: '小心它的刺，非常锋利。', rarity: 'rare', value: 30, icon: '🐡', type: 'fish', environment: 'saltwater' },
  { id: 'firefin', name: '火鳍鲷', description: '这种鱼摸起来是热的。', rarity: 'rare', value: 35, icon: '🔥', type: 'fish', environment: 'lava' },

  // Epic
  { id: 'blackmouth', name: '变异黑口鱼', description: '炼金术士的最爱。', rarity: 'epic', value: 100, icon: '🦈', type: 'fish', environment: 'saltwater' },
  { id: 'stonescale', name: '石鳞鳗', description: '它的鳞片硬如岩石。', rarity: 'epic', value: 120, icon: '🐉', type: 'fish', environment: 'all' },

  // Trash
  { id: 'boot', name: '破损的靴子', description: '谁把这东西扔河里了？', rarity: 'trash', value: 1, icon: '👢' },
  { id: 'weeds', name: '缠结的水草', description: '一团黏糊糊的绿色植物。', rarity: 'trash', value: 0, icon: '🌿' },
  { id: 'driftwood', name: '漂流木', description: '也许能卖给木匠。', rarity: 'trash', value: 2, icon: '🪵' },

  // Treasure
  { id: 'chest', name: '浸水的宝箱', description: '里面会有什么呢？', rarity: 'treasure', value: 500, icon: '💎' },
];
