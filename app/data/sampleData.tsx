// data/sampleData.ts
"use client"; 

export interface ArtworkItem {
  id: string;
  title: string;
  image: string;
  artist: string;
  price: string;
  description?: string;
  dimensions?: string;
  medium?: string;
  year?: string;
  inStock?: boolean;
  featured?: boolean;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  style?: string;
  tags?: string[];
  universe?: string;
  universeDescription?: string;
  lore?: string;
  collection?: string;
  relatedCharacters?: {
    name: string;
    relation: string;
    image?: string;
  }[];
  blockchain?: string;
  tokenId?: string;
  contract?: string;
  mintDate?: string;
  edition?: {
    current: number;
    total: number;
  };
  ownershipHistory?: {
    owner: string;
    date: string;
    price: string;
  }[];
  royalties?: {
    percentage: number;
    description?: string;
  };
}

export interface GameItem {
  id: string;
  title: string;
  description: string;
  image: string;
  genre: string;
  platform: string[];
  rating: number;
  releaseDate: string;
  publisher: string;
  price: string;
}

export const featuredArt: ArtworkItem[] = [
  {
    "id": "1",
    "title": "Chiu from Pixel Wasteland",
    "image": "/images/Chiu.png",
    "artist": "PixelMaster",
    "price": "$800",
    "description": "A normal school girl navigating the remnants of a post-apocalyptic world, wearing a delicate flower in her hair.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2024",
    "inStock": true,
    "featured": true,
    "rarity": "Rare",
    "style": "Post-Apocalyptic",
    "tags": ["school girl", "wasteland", "pixel art", "nature"],
    "universe": "Pixel Wasteland",
    "universeDescription": "A world left in ruins, where nature slowly reclaims the remains of civilization.",
    "lore": "Once an ordinary student, Chiu now wanders through the desolate landscapes, preserving the beauty of the past in a world struggling to survive.",
    "collection": "Wasteland Survivors"
},
  // Add more artwork items...

  {
    id: "2",
    title: "Cyber Zombie",
    image: "/images/Cyber Zombie.png",
    artist: "Ryuski",
    price: "$200",
    description: "A decayed warrior resurrected through cybernetic enhancements, roaming the neon-lit streets of Cyber City in search of lost memories.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2022",
    inStock: true,
    featured: true,
    rarity: "Rare",
    style: "Cyberpunk",
    tags: ["cyberpunk", "zombie", "cybernetic", "undead"],
    universe: "Cyber City ",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a brilliant scientist, he was betrayed and left for dead in the depths of Cyber City. Revived by rogue AI with cybernetic implants, his consciousness is fragmented, haunted by flashes of his past life. Now, he wanders the digital wastelands, seeking vengeance against those who turned him into an undead machine.",
    collection: "Cyber Warriors"
  },
  {
    id: "3",
    title: "Digial Creator",
    image: "/images/Digital Creator.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A visionary artist who sculpts reality itself with digital code, bringing cybernetic dreams to life in the neon-lit metaverse.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["creator", "digital", "cyberpunk", "AI"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "In a world where reality is nothing but data, the Digital Creator is revered as a godlike figure. They wield an ancient algorithm capable of rewriting existence itself, but at a great cost—every masterpiece drains a fragment of their own consciousness into the digital abyss. Now, their creations roam Neo Tokyo, fragments of their fading soul encoded in every pixel.",
    collection: "Cindy's Creations"
  },

   {
    id: "4",
    title: "Ariza",
    image: "/images/Ariza.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A mysterious warrior shrouded in crimson, wielding ancient curved blades and guarding the secrets of a lost civilization.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Uncommon",
    style: "Angel Cyber",
    tags: ["warrior", "mystic", "rogue", "ancient", "golden ruins"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a mere disciple of the Order of the Twin Serpents, Ariza uncovered a prophecy buried beneath the golden ruins. Now a rogue warrior, they traverse Eldoria, seeking the final piece of the Celestial Key—an artifact capable of restoring the lost kingdom or dooming it forever.",
    collection: "Legends of Eldoria"
  },


  {
    id: "5",
    title: "Glitch Ninja",
    image: "/images/Glick Ninja.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A stealthy cyber-assassin cloaked in digital shadows, wielding twin energy katanas that distort reality with every strike.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk, Digital Phantom",
    tags: ["ninja", "cyberpunk", "glitch", "stealth", "assassin"],
    universe: "Neo Tokyo",
    universeDescription: "A cybernetic feudal world where the ancient ways of the samurai collide with futuristic technology.",
    lore: "Once an elite warrior of the Neo Shogunate, the Glitch Ninja was betrayed and left for dead in the void of cyberspace. But instead of perishing, they became one with the digital realm—an anomaly that exists between the physical and virtual worlds. Now, they seek vengeance, striking from the digital shadows and rewriting reality with every move.",
    collection: "Cyber Warriors"
  },

  {
    id: "6",
    title: "HackerMan",
    image: "/images/Hackerman.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
    // tanggalin yung ganto "" yung sa rightside lang example: "id" just id:

  {
    id: "7",
    title: "Neo Ronin",
    image: "/images/Neo Ronin.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
  {
    "id": "8",
    "title": "Neo Oni",
    "image": "/images/Neon Oni.png",
    "artist": "PixelMaster",
    "price": "$1,200",
    "description": "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2023",
    "inStock": true,
    "featured": true,
    "rarity": "Legendary",
    "style": "Cyberpunk",
    "tags": ["samurai", "cyberpunk", "warrior", "neon"],
    "universe": "Neo Tokyo",
    "universeDescription": "A dystopian future where traditional cultures blend with advanced technology.",
    "lore": "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    "collection": "Cyber Warriors"
  },
  {
    "id": "9",
    "title": "Shadow Hacker",
    "image": "/images/Shadow Hacker.png",
    "artist": "PixelMaster",
    "price": "$1,200",
    "description": "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2023",
    "inStock": true,
    "featured": true,
    "rarity": "Legendary",
    "style": "Cyberpunk",
    "tags": ["samurai", "cyberpunk", "warrior", "neon"],
    "universe": "Neo Tokyo",
    "universeDescription": "A dystopian future where traditional cultures blend with advanced technology.",
    "lore": "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    "collection": "Cyber Warriors"
  },
  {
    "id": "10",
    "title": "Leana",
    "image": "/images/Axe Girl.png",
    "artist": "PixelMaster",
    "price": "$1,200",
    "description": "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2023",
    "inStock": true,
    "featured": true,
    "rarity": "Legendary",
    "style": "Cyberpunk",
    "tags": ["samurai", "cyberpunk", "warrior", "neon"],
    "universe": "Neo Tokyo",
    "universeDescription": "A dystopian future where traditional cultures blend with advanced technology.",
    "lore": "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    "collection": "Cyber Warriors"
  },

  {
    id: "11",
    title: "Yaomi",
    image: "/images/Maniac.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
},

{
    id: "12",
    title: "Clown Zombie",
    image: "/images/Clown Town.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
},

{
    id: "13",
    title: "Demon Slayer",
    image: "/images/Demon Slayer.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
},

{
    id: "14",
    title: "Zeku",
    image: "/images/IceMan.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
},

{
    id: "15",
    title: "Ish",
    image: "/images/Ish.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
},


  {
    "id": "16",
    "title": "Mola",
    "image": "/images/Muscle Gen.png",
    "artist": "PixelMaster",
    "price": "$1,200",
    "description": "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2023",
    "inStock": true,
    "featured": true,
    "rarity": "Legendary",
    "style": "Cyberpunk",
    "tags": ["samurai", "cyberpunk", "warrior", "neon"],
    "universe": "Neo Tokyo",
    "universeDescription": "A dystopian future where traditional cultures blend with advanced technology.",
    "lore": "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    "collection": "Cyber Warriors"
  },
  {
    "id": "17",
    "title": "Ryuski",
    "image": "/images/Ryuski.png",
    "artist": "PixelMaster",
    "price": "$1,200",
    "description": "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2023",
    "inStock": true,
    "featured": true,
    "rarity": "Legendary",
    "style": "Cyberpunk",
    "tags": ["samurai", "cyberpunk", "warrior", "neon"],
    "universe": "Neo Tokyo",
    "universeDescription": "A dystopian future where traditional cultures blend with advanced technology.",
    "lore": "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    "collection": "Cyber Warriors"
  },
  {
    "id": "18",
    "title": "Dragonite",
    "image": "/images/Dragon.png",
    "artist": "PixelMaster",
    "price": "$1,200",
    "description": "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2023",
    "inStock": true,
    "featured": true,
    "rarity": "Legendary",
    "style": "Cyberpunk",
    "tags": ["samurai", "cyberpunk", "warrior", "neon"],
    "universe": "Neo Tokyo",
    "universeDescription": "A dystopian future where traditional cultures blend with advanced technology.",
    "lore": "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    "collection": "Cyber Warriors"
  },
  {
    "id": "19",
    "title": "Bryan",
    "image": "/images/Archer Bryan.png",
    "artist": "PixelMaster",
    "price": "$1,200",
    "description": "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2023",
    "inStock": true,
    "featured": true,
    "rarity": "Legendary",
    "style": "Cyberpunk",
    "tags": ["samurai", "cyberpunk", "warrior", "neon"],
    "universe": "Neo Tokyo",
    "universeDescription": "A dystopian future where traditional cultures blend with advanced technology.",
    "lore": "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    "collection": "Cyber Warriors"
  },
  {
    "id": "20",
    "title": "Cimbi",
    "image": "/images/Undead Samurai.png",
    "artist": "PixelMaster",
    "price": "$1,200",
    "description": "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    "dimensions": "64 x 64 px",
    "medium": "Pixel Art, NFT",
    "year": "2023",
    "inStock": true,
    "featured": true,
    "rarity": "Legendary",
    "style": "Cyberpunk",
    "tags": ["samurai", "cyberpunk", "warrior", "neon"],
    "universe": "Neo Tokyo",
    "universeDescription": "A dystopian future where traditional cultures blend with advanced technology.",
    "lore": "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    "collection": "Cyber Warriors"
  },


  {
    id: "21",
    title: "Chill Guy",
    image: "/images/biker.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
  {
    id: "22",
    title: "Rian",
    image: "/images/Cubehead Girl.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
  {
    id: "23",
    title: "R & T",
    image: "/images/DingDong.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
  {
    id: "24",
    title: "Kimenshi",
    image: "/images/Axeman.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
  {
    id: "25",
    title: "Warrior Kenshin",
    image: "/images/Warrior Man.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
  {
    id: "26",
    title: "Losan",
    image: "/images/Losan.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
  {
    id: "27",
    title: "Monak",
    image: "/images/Cyber Villain.png",
    artist: "PixelMaster",
    price: "$1,200",
    description: "A futuristic samurai warrior with neon accents, standing guard in a cyberpunk cityscape.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2023",
    inStock: true,
    featured: true,
    rarity: "Legendary",
    style: "Cyberpunk",
    tags: ["samurai", "cyberpunk", "warrior", "neon"],
    universe: "Neo Tokyo",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Once a traditional samurai, now enhanced with cybernetic implants to protect Neo Tokyo.",
    collection: "Cyber Warriors"
  },
];

export interface GameItem {
  id: string;
  title: string;
  description: string;
  image: string;
  genre: string;
  platform: string[];
  rating: number;
  releaseDate: string;
  publisher: string;
  price: string;
  assetTypes?: string[]; // ✅ Add this line
}
