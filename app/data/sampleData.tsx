// data/sampleData.ts
export interface ArtworkItem {
  id: string;
  title: string;
  image: string;
  artist: string;
  price: string;
  category: string;
  description?: string;
  dimensions?: string;
  medium?: string;
  year?: string;
  inStock?: boolean;
  // New fields for custom descriptions
  lore?: string;          // For "Ariza, the masked warrior..." type descriptions
  universe?: string;      // For "This artwork is part of the Forgotten Legends universe!"
  collectibleInfo?: string; // For "Every piece tells a story – collect them all..."
  nftInfo?: string;       // For "NFT-ready: Easily integrate into digital galleries."
  printInfo?: string;     // For "Need a print version?..." (common to all)
  communityInfo?: string; // For "Join our Discord..." (common to all)
}

export const featuredArt: ArtworkItem[] = [
  {
    id: '1',
    title: 'Ariza',
    image: '/Ariza.png',
    artist: 'Aaron',
    price: '$200',
    category: 'Cyberpunk',
    lore: "Ariza, the masked warrior, holds the fate of a lost kingdom.",
    universe: "This artwork is part of the Forgotten Legends universe!",
    collectibleInfo: "Every piece tells a story – collect them all to unlock secrets!",
    nftInfo: "NFT-ready: Easily integrate into digital galleries.",
    printInfo: "Need a print version? We offer premium canvas prints!",
    communityInfo: "Join our Discord to see new art before anyone else!",
    inStock: true
  },
  {
    id: '2',
    title: 'Cyber Samurai',
    image: '/Cyber Samurai.png',
    artist: 'Rimuru',
    price: '$350',
    category: 'Samurai',
    lore: "The last of the digital ronin, defending the net against corporate AIs.",
    universe: "This artwork is part of the Forgotten Legends universe!",
    collectibleInfo: "Every piece tells a story – collect them all to unlock secrets!",
    nftInfo: "NFT-ready: Easily integrate into digital galleries.",
    printInfo: "Need a print version? We offer premium canvas prints!",
    communityInfo: "Join our Discord to see new art before anyone else!",
    inStock: true
  },
  {
    id: '3',
    title: 'Neo Ronin',
    image: '/Neo Ronin.png',
    artist: 'Shawn',
    price: '$150',
    category: 'Cyber',
    lore: "A digital samurai wandering the ruins of the old network.",
    universe: "This artwork is part of the Forgotten Legends universe!",
    collectibleInfo: "Every piece tells a story – collect them all to unlock secrets!",
    nftInfo: "NFT-ready: Easily integrate into digital galleries.",
    printInfo: "Need a print version? We offer premium canvas prints!",
    communityInfo: "Join our Discord to see new art before anyone else!",
    inStock: true
  },
  {
    id: '4',
    title: 'Neo Oni',
    image: '/Neon Oni.png',
    artist: 'Jimin',
    price: '$110',
    category: 'Cyber',
    lore: "Ancient demon meets future tech in this reimagined yokai.",
    universe: "This artwork is part of the Forgotten Legends universe!",
    collectibleInfo: "Every piece tells a story – collect them all to unlock secrets!",
    nftInfo: "NFT-ready: Easily integrate into digital galleries.",
    printInfo: "Need a print version? We offer premium canvas prints!",
    communityInfo: "Join our Discord to see new art before anyone else!",
    inStock: true
  },
  {
    id: '5',
    title: 'Shadow Hacker',
    image: '/Shadow Hacker.png',
    artist: 'Ryuski',
    price: '$400',
    category: 'Cyber',
    lore: "Moving through digital shadows, this infiltrator leaves no trace.",
    universe: "This artwork is part of the Forgotten Legends universe!",
    collectibleInfo: "Every piece tells a story – collect them all to unlock secrets!",
    nftInfo: "NFT-ready: Easily integrate into digital galleries.",
    printInfo: "Need a print version? We offer premium canvas prints!",
    communityInfo: "Join our Discord to see new art before anyone else!",
    inStock: true
  },
  {
    id: '6',
    title: 'Cyber Zombie',
    image: '/Cyber Zombie.png',
    artist: 'Winra',
    price: '$180',
    category: 'Cyber',
    lore: "Half-human, half-machine, fully lost in the digital void.",
    universe: "This artwork is part of the Forgotten Legends universe!",
    collectibleInfo: "Every piece tells a story – collect them all to unlock secrets!",
    nftInfo: "NFT-ready: Easily integrate into digital galleries.",
    printInfo: "Need a print version? We offer premium canvas prints!",
    communityInfo: "Join our Discord to see new art before anyone else!",
    inStock: true
  },
  {
    id: '7',
    title: 'Hackerman',
    image: '/Hackerman.png',
    artist: 'Ampoloppa',
    price: '$500',
    category: 'Cyber',
    lore: "From the shadows, Hackerman manipulates the flow of digital reality.",
    universe: "This artwork is part of the Forgotten Legends universe!",
    collectibleInfo: "Every piece tells a story – collect them all to unlock secrets!",
    nftInfo: "NFT-ready: Easily integrate into digital galleries.",
    printInfo: "Need a print version? We offer premium canvas prints!",
    communityInfo: "Join our Discord to see new art before anyone else!",
    inStock: true
  }
];

export const featuredGames = [
  {
    id: '1',
    title: 'Neon Nightmares',
    genre: 'Cyberpunk',
  },
  {
    id: '2',
    title: 'Pixel Pirates',
    genre: 'Adventure',
  },
];