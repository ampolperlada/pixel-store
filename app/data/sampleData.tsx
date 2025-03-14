// data/sampleData.ts


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
    id: "1",
    title: "Cyber Samurai",
    image: "/images/Cyber Samurai.png",
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
  // Add more artwork items...

  {
    id: "2",
    title: "Cyber Zombie",
    image: "/images/Cyber Zombie.png",
    artist: "Ryuski",
    price: "$200",
    description: "Sample Sample Sample Sample Text  Sample Sample.",
    dimensions: "64 x 64 px",
    medium: "Pixel Art, NFT",
    year: "2022",
    inStock: true,
    featured: true,
    rarity: "Rare",
    style: "Cyberpunk",
    tags: ["cyberpunk", "warrior", "neon"],
    universe: "Cyber City ",
    universeDescription: "A dystopian future where traditional cultures blend with advanced technology.",
    lore: "Sample Sample Sample",
    collection: "Cyber Warriors"
  },
  {
    id: "3",
    title: "Digial Creator",
    image: "/images/Digital Creator.png",
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
    id: "4",
    title: "Ariza",
    image: "/images/Ariza.png",
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
    id: "5",
    title: "Glitch Ninja",
    image: "/images/Glitch Ninja.png",
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
    id: "8",
    title: "Neo Oni",
    image: "/images/Neon Oni.png",
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
    id: "9",
    title: "Shadow Hacker",
    image: "/images/Shadow Hacker.png",
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
    id: "10",
    title: "Leana",
    image: "/images/Axe Girl.png",
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
    id: "16",
    title: "Mola",
    image: "/images/Muscle Gen.png",
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
    id: "17",
    title: "Ryuski",
    image: "/images/Ryuski.png",
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
    id: "17",
    title: "Ryuski",
    image: "/images/Ryuski.png",
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

export const featuredGames: GameItem[] = [
  {
    id: "3",
    title: "Pixel Quest",
    description: "An epic adventure through a beautifully crafted pixel world.",
    image: "/images/game1.jpg",
    genre: "RPG",
    platform: ["PC", "Mac", "Mobile"],
    rating: 4.8,
    releaseDate: "2023-06-15",
    publisher: "PixelStudio Games",
    price: "$19.99"
  },
  // Add more game items...
];
