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
    artist: 'Aaron',
    price: '$200',
    category: 'Cyberpunk',
  },
  {
    id: '2',
    title: 'Cyber Samurai',
    image: '/Cyber Samurai.png',
    artist: 'Rimuru',
    price: '$350',
    category: 'Samurai',
  },
  {
    id: '3',
    title: 'Neo Ronin',
    image: '/Neo Ronin.png',
    artist: 'Shawn',
    price: '$150',
    category: 'Cyber',
  },
  {
    id: '4',
    title: 'Neo Oni',
    image: '/Neon Oni.png',
    artist: 'Jimin',
    price: '$110',
    category: 'Cyber',
  },
  {
    id: '5',
    title: 'Shadow Hacker',
    image: '/Shadow Hacker.png',
    artist: 'Ryuski',
    price: '$400',
    category: 'Cyber',
  },
  {
    id: '6',
    title: 'Cyber Zombie',
    image: '/Cyber Zombie.png',
    artist: 'Winra',
    price: '$180',
    category: 'Cyber',
  },
  {
    id: '7',
    title: 'Hackerman',
    image: '/Hackerman.png',
    artist: 'Ampoloppa',
    price: '$500',
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
