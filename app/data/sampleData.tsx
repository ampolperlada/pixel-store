// Define and export ArtworkItem interface
export interface ArtworkItem {
  id: string;
  title: string;
  image: string;
  artist: string;
  price: string;
  category: string;
}

// Export sample artwork data
export const featuredArt: ArtworkItem[] = [
  {
    id: '1',
    title: 'Ariza',
    image: '/Ariza.png', // ✅ Image from public folder
    artist: 'John Doe',
    price: '$200',
    category: 'Cyberpunk',
  },
  {
    id: '2',
    title: 'Cyber Samurai',
    image: '/Cyber Samurai.png',
    artist: 'Jane Doe',
    price: '$250',
    category: 'Samurai',
  },
  {
    id: '3',
    title: 'Digital Creator',
    image: '/Digital Creator.png',
    artist: 'Alex Smith',
    price: '$300',
    category: 'Futuristic',
  }
];
