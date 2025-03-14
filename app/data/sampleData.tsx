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
    image: "/images/artwork1.jpg",
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
];

export const featuredGames: GameItem[] = [
  {
    id: "1",
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
