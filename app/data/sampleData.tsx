// data/sampleData.ts

export interface ArtworkItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  category: string;
  gameReady?: boolean;
  price: string;
}

export interface GameItem {
  id: string;
  title: string;
  developer: string;
  imageUrl: string;
  category: string;
  price?: string;
  // Add other game properties as needed
}

export const featuredArt: ArtworkItem[] = [
  {
    id: '1',
    title: 'Neo Ronin',
    artist: 'PixelMaster',
    imageUrl: '/path/to/image1.jpg',
    category: 'cyberpunk',
    gameReady: true,
    price: '0.05 ETH'
  },
  {
    id: '2',
    title: 'Cyber Samurai',
    artist: 'RetroArtist',
    imageUrl: '/path/to/image2.jpg',
    category: 'cyberpunk',
    gameReady: true,
    price: '0.08 ETH'
  },
  // Add the rest of your artwork items here
];

export const featuredGames: GameItem[] = [
  // Your game data here
];