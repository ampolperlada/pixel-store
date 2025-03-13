// 📌 Ensure this is inside `data/sampleData.ts`
export interface ArtworkItem {
  id: string;
  title: string;
  image: string;
  artist: string;
  price: string;
  category: string;
}


export const featuredArt: ArtworkItem[] = [
  {
    id: '1',
    title: 'Ariza',
    image: '/Ariza.png',
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
    title: 'Neo Ronin',
    image: '/Neo Ronin.png',
    artist: 'Jane Doe',
    price: '$250',
    category: 'Cyber',
  },
  {
    id: '4',
    title: 'Neo Oni',
    image: '/Neon Oni.png',
    artist: 'Jane Doe',
    price: '$250',
    category: 'Cyber',
  },
  {
    id: '5',
    title: 'Shadow Hacker',
    image: '/Shadow Hacker.png',
    artist: 'Jane Doe',
    price: '$250',
    category: 'Cyber',
  },
  {
    id: '6',
    title: 'Cyber Zombie',
    image: '/Cyber Zombie.png',
    artist: 'Jane Doe',
    price: '$250',
    category: 'Cyber',
  },

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
