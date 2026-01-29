# Pixel Store - Digital Art Marketplace

> A next-generation NFT marketplace for pixel art creators and collectors

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://pixel-store.vercel.app)
[![Status](https://img.shields.io/badge/status-beta-orange)](https://github.com/ampolperlada/pixel-store)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

![Pixel Store Banner](./public/banner.png)

## About

Pixel Store is a modern, full-stack web3 marketplace designed to empower digital artists and collectors. Built with cutting-edge technologies, it provides creators with tools to mint, sell, and monetize their pixel art while offering collectors a seamless experience to discover and own unique digital assets.

### Key Features

- **Creator Studio** - Intuitive pixel art editor with instant minting
- **NFT Marketplace** - Browse, buy, and sell unique digital art
- **Artist Profiles** - Showcase your portfolio and build your brand
- **Automated Royalties** - Earn passive income from secondary sales
- **Real-time Analytics** - Track your sales and engagement
- **Secure Transactions** - Built on Ethereum with enterprise-grade security
- **Web3 Integration** - Seamless wallet connection and blockchain interaction

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- NextAuth.js

**Backend:**
- Node.js / Express
- Prisma ORM
- PostgreSQL (Supabase)
- MongoDB
- Socket.IO

**Web3:**
- Ethers.js
- Smart Contracts (Solidity)

**DevOps:**
- Vercel (Frontend)
- Docker
- GitHub Actions (CI/CD)

## Screenshots

### Homepage
![Homepage](./public/screenshots/home.png)

### Creator Studio
![Creator Studio](./public/screenshots/creator.png)

### Marketplace
![Marketplace](./public/screenshots/marketplace.png)

## Project Status

**Current Version:** Beta v1.0

This project is currently in beta and actively being developed. Core features are functional, and I'm continuously adding new capabilities based on user feedback.

### Roadmap
- [x] User authentication & profiles
- [x] NFT minting & marketplace
- [x] Real-time trending data
- [x] Creator royalty system
- [ ] Mobile app (React Native)
- [ ] Layer 2 integration (Polygon)
- [ ] Social features & comments
- [ ] Advanced analytics dashboard

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL or Supabase account
- MongoDB instance

### Installation
```bash
# Clone the repository
git clone https://github.com/ampolperlada/pixel-store.git
cd pixel-store

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
cd backend
npx prisma migrate dev

# Start development servers
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Environment Variables
```env
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Backend (.env)
DATABASE_URL=your_postgres_connection_string
MONGODB_URI=your_mongodb_connection_string
```

## Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **Load Time:** <2s on 3G
- **Bundle Size:** <200kb initial load

## Contributing

This is a personal portfolio project, but I welcome feedback and suggestions! Feel free to open an issue or reach out directly.

## About the Developer

Built by **ampolperlada** - Full-stack developer passionate about web3 and digital art.

- [GitHub](https://github.com/ampolperlada)
- [LinkedIn](https://linkedin.com/in/yourprofile)
- [Email](mailto:your.email@example.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from OpenSea and Foundation
- Community feedback from beta testers
- Built as part of my journey learning web3 development

---

**Star this repo if you find it interesting!**

Made with love by [ampolperlada](https://github.com/ampolperlada)