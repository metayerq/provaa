
export interface Category {
  id: string;
  label: string;
  emoji: string;
  description?: string;
  group: string;
}

export const expandedCategories: Category[] = [
  // Wine & Spirits
  { id: 'natural-wine', label: 'Natural Wine Tasting', emoji: '🍷', group: 'Wine & Spirits', description: 'Explore organic and biodynamic wines' },
  { id: 'vintage-port', label: 'Vintage Port Workshop', emoji: '🍾', group: 'Wine & Spirits', description: 'Portuguese dinner at grandma\'s home' },
  { id: 'wine-cheese-pairing', label: 'Wine & Cheese Pairing', emoji: '🧀', group: 'Wine & Spirits', description: 'Perfect wine and cheese combinations' },
  { id: 'whiskey-distillery', label: 'Whiskey Distillery Experience', emoji: '🥃', group: 'Wine & Spirits', description: 'Behind the scenes at a whiskey distillery' },
  { id: 'craft-cocktail', label: 'Craft Cocktail Workshop', emoji: '🍸', group: 'Wine & Spirits', description: 'Learn mixology from the pros' },

  // Coffee & Tea
  { id: 'coffee-roasting', label: 'Coffee Roasting Workshop', emoji: '☕', group: 'Coffee & Tea', description: 'From bean to cup mastery' },
  { id: 'tea-ceremony', label: 'Traditional Tea Ceremony', emoji: '🍵', group: 'Coffee & Tea', description: 'Ancient tea traditions and mindfulness' },
  { id: 'latte-art', label: 'Latte Art Masterclass', emoji: '☕', group: 'Coffee & Tea', description: 'Create beautiful coffee art' },

  // Artisan Food Production
  { id: 'olive-oil-making', label: 'Olive Oil Making Workshop', emoji: '🫒', group: 'Artisan Production', description: 'From olive to liquid gold' },
  { id: 'chocolate-tempering', label: 'Chocolate Tempering Masterclass', emoji: '🍫', group: 'Artisan Production', description: 'Professional chocolate techniques' },
  { id: 'artisan-cheese', label: 'Artisan Cheese Making', emoji: '🧀', group: 'Artisan Production', description: 'Craft your own cheese from scratch' },
  { id: 'sourdough-bread', label: 'Sourdough Bread Workshop', emoji: '🍞', group: 'Artisan Production', description: 'Master the art of sourdough' },
  { id: 'fermentation-deep-dive', label: 'Fermentation Deep Dive', emoji: '🥒', group: 'Artisan Production', description: 'Explore kimchi, kombucha & more' },
  { id: 'craft-beer-brewing', label: 'Craft Beer Brewing Tour', emoji: '🍺', group: 'Artisan Production', description: 'Brewing process from grain to glass' },

  // Cultural Dining Experiences
  { id: 'private-dinner-home', label: 'Private Dinner at Home', emoji: '🏠', group: 'Cultural Dining', description: 'Intimate dining in a cozy home setting' },
  { id: 'greek-picnic-park', label: 'Greek Picnic at the Park', emoji: '🧺', group: 'Cultural Dining', description: 'Authentic Greek feast outdoors' },
  { id: 'portuguese-grandma', label: 'Portuguese Dinner at Grandma\'s Home', emoji: '👵', group: 'Cultural Dining', description: 'Traditional family recipes and stories' },
  { id: 'italian-nonna', label: 'Italian Nonna\'s Kitchen', emoji: '👩‍🍳', group: 'Cultural Dining', description: 'Homemade pasta and family traditions' },
  { id: 'moroccan-feast', label: 'Moroccan Feast Experience', emoji: '🕌', group: 'Cultural Dining', description: 'Authentic tagines and mint tea' },
  { id: 'japanese-kaiseki', label: 'Japanese Kaiseki Dinner', emoji: '🍱', group: 'Cultural Dining', description: 'Multi-course seasonal Japanese cuisine' },

  // Specialty Tastings
  { id: 'honey-tasting', label: 'Artisan Honey Tasting', emoji: '🍯', group: 'Specialty Tastings', description: 'Single-origin honeys from local apiaries' },
  { id: 'truffle-hunting', label: 'Truffle Hunting & Tasting', emoji: '🍄', group: 'Specialty Tastings', description: 'Hunt and taste these precious fungi' },
  { id: 'salt-tasting', label: 'Gourmet Salt Tasting', emoji: '🧂', group: 'Specialty Tastings', description: 'Salts from around the world' },
  { id: 'spice-journey', label: 'Global Spice Journey', emoji: '🌶️', group: 'Specialty Tastings', description: 'Explore spices and their origins' },

  // Farm-to-Table
  { id: 'farm-dinner', label: 'Farm-to-Table Dinner', emoji: '🚜', group: 'Farm-to-Table', description: 'Dine where your food is grown' },
  { id: 'foraging-walk', label: 'Foraging Walk & Cook', emoji: '🌿', group: 'Farm-to-Table', description: 'Gather wild edibles and cook together' },
  { id: 'garden-harvest', label: 'Garden Harvest Experience', emoji: '🥕', group: 'Farm-to-Table', description: 'Pick, cook, and eat fresh produce' },

  // Baking & Pastry
  { id: 'croissant-making', label: 'Croissant Making Class', emoji: '🥐', group: 'Baking & Pastry', description: 'Master the art of laminated dough' },
  { id: 'macaron-workshop', label: 'French Macaron Workshop', emoji: '🍪', group: 'Baking & Pastry', description: 'Perfect the delicate macaron technique' },
  { id: 'cake-decorating', label: 'Cake Decorating Masterclass', emoji: '🎂', group: 'Baking & Pastry', description: 'Professional cake decoration techniques' }
];

export const categoryGroups = [
  'Wine & Spirits',
  'Coffee & Tea', 
  'Artisan Production',
  'Cultural Dining',
  'Specialty Tastings',
  'Farm-to-Table',
  'Baking & Pastry'
];
