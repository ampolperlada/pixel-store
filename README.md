# Pixel Forge - NFT Marketplace Demo

A full-stack NFT marketplace demonstration built with Next.js 15, showcasing modern web development practices and UI/UX design.

![Pixel Forge Homepage](https://via.placeholder.com/1200x630?text=Pixel+Forge+Homepage)

## Project Status: Demo/Portfolio

This is a **demonstration project** built to showcase full-stack development capabilities. It uses sample data and simulated functionality for portfolio purposes.

---

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **React Hooks** - State management
- **NextAuth.js** - Authentication framework

### Backend (Ready for Production)
- **Next.js API Routes** - Serverless backend
- **Prisma ORM** - Database management
- **PostgreSQL** - Relational database
- **NextAuth.js** - OAuth & credential auth

### Web3 Integration
- **MetaMask** - Wallet connection
- **ethers.js** - Ethereum interaction (ready)
- **Web3 Modal** - Multi-wallet support (ready)

### Additional Features
- **Google ReCAPTCHA** - Bot protection
- **Resend API** - Email notifications (configured)
- **Responsive Design** - Mobile-first approach

---

## Features Implemented

### Authentication System
- Email/password registration and login
- Google OAuth integration (configured)
- MetaMask wallet connection
- Session management with NextAuth
- Protected routes

### User Interface
- Responsive navigation
- Modal-based authentication flows
- Interactive artwork galleries
- Trending collections display
- Artist showcase
- Statistics dashboard
- Community highlights

### Backend Architecture
- RESTful API endpoints
- Database schema (Prisma)
- User management
- Session handling
- Email verification (configured)

---

## Demo Mode Features

Since this is a portfolio demonstration:

- **Local Storage**: User data stored in browser
- **Mock Data**: Sample artwork and statistics
- **Simulated Flows**: Authentication redirects to success pages
- **No Database Calls**: Database paused for demo (schema ready for production)

---

## Architecture Overview

### Frontend Architecture
```
app/
├── (pages)/
│   ├── page.tsx                 # Homepage
│   ├── explore/                 # Marketplace
│   ├── create/                  # Art creation tool
│   ├── profile/                 # User profiles
│   └── waitlist/               # Demo signup flow
│
├── components/
│   ├── layout/                  # Navigation, Footer
│   ├── context/                 # Auth, Modal contexts
│   ├── ui/                      # Reusable UI components
│   └── [feature]/              # Feature-specific components
│
├── api/
│   ├── auth/[...nextauth]/     # NextAuth handler
│   ├── signup/                  # User registration
│   └── [endpoints]/            # Various API routes
│
└── lib/
    ├── prisma.ts               # Database client
    └── auth.ts                 # Auth configuration
```

### Component Structure
- **Server Components** (default): Static content, SEO optimization
- **Client Components** (`'use client'`): Interactive features, state management
- **Contexts**: Global state (Auth, Modals)
- **Hooks**: Reusable logic

### State Management
- React Context API for global state
- Local state with useState/useReducer
- Server state with NextAuth sessions

---

## Future Backend Architecture

When moving to production, the system would implement:

### Database Layer (PostgreSQL + Prisma)
```
┌─────────────────────────────────────┐
│         Prisma Schema               │
├─────────────────────────────────────┤
│  User                               │
│  - id, email, password, wallet      │
│  - profile, settings                │
│                                     │
│  Artwork                            │
│  - id, title, image, metadata       │
│  - creator, price, tokenId          │
│                                     │
│  Transaction                        │
│  - id, buyer, seller, artwork       │
│  - amount, timestamp, status        │
│                                     │
│  Collection                         │
│  - id, name, artworks[]             │
└─────────────────────────────────────┘
```

### API Layer
```
/api
├── /auth
│   ├── signup              # User registration
│   ├── login               # Authentication
│   └── [...nextauth]       # OAuth handlers
│
├── /artwork
│   ├── GET /               # List artworks
│   ├── POST /              # Create artwork
│   ├── GET /[id]           # Artwork details
│   └── PUT /[id]           # Update artwork
│
├── /user
│   ├── GET /profile        # User profile
│   ├── PUT /profile        # Update profile
│   └── GET /[username]     # Public profile
│
└── /marketplace
    ├── GET /trending       # Trending items
    ├── GET /search         # Search artworks
    └── POST /purchase      # Buy artwork
```

### Blockchain Integration (Phase 2)
```
Web3 Layer:
├── Smart Contracts (Solana/Ethereum)
│   ├── NFT Minting
│   ├── Marketplace
│   └── Royalty Distribution
│
├── Wallet Integration
│   ├── MetaMask
│   ├── Phantom (Solana)
│   └── WalletConnect
│
└── IPFS Storage
    ├── Artwork files
    └── Metadata JSON
```

### Caching & Performance
```
Performance Layer:
├── Redis (Caching)
│   ├── Session storage
│   ├── Trending data
│   └── API rate limiting
│
├── CDN (Images)
│   ├── Cloudflare/Vercel
│   └── Image optimization
│
└── Database Optimization
    ├── Indexes on hot paths
    ├── Query optimization
    └── Connection pooling
```

### Real-time Features (Future)
```
Real-time:
├── WebSockets (Pusher/Ably)
│   ├── Live bidding
│   ├── Chat/comments
│   └── Notifications
│
└── Server-Sent Events
    ├── Price updates
    └── New listings
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (for production)
- MetaMask browser extension (optional)

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/pixel-forge.git
cd pixel-forge

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configurations

# Run development server
npm run dev
```

### Environment Variables
```env
# Database (for production)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email (Resend)
RESEND_API_KEY="..."

# ReCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="..."
RECAPTCHA_SECRET_KEY="..."
```

---

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Database Setup (Production)
```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

---

## Project Structure Details

### Key Files

- `app/page.tsx` - Homepage with all sections
- `app/components/SignupModal.tsx` - Demo signup flow
- `app/components/Footer.tsx` - Project info & tech stack
- `prisma/schema.prisma` - Database schema
- `lib/auth.ts` - NextAuth configuration

### Styling Approach

- TailwindCSS utility classes
- Custom gradients and animations
- Dark theme throughout
- Responsive breakpoints (sm, md, lg, xl)

---

## Roadmap

### Phase 1: Foundation (Current)
- [x] Frontend UI/UX
- [x] Authentication system
- [x] Database schema
- [x] Basic API routes

### Phase 2: Backend Integration
- [ ] Enable PostgreSQL database
- [ ] Implement all API endpoints
- [ ] File upload (artwork images)
- [ ] User profile system

### Phase 3: Web3 Features
- [ ] Smart contract deployment
- [ ] NFT minting
- [ ] Blockchain transactions
- [ ] IPFS integration

### Phase 4: Advanced Features
- [ ] Search & filtering
- [ ] Bidding system
- [ ] Creator analytics
- [ ] Social features

---

## Performance Considerations

### Current Optimizations
- Next.js Image optimization
- Server-side rendering for SEO
- Component code splitting
- Lazy loading for modals

### Future Optimizations
- Redis caching layer
- Database query optimization
- CDN for static assets
- Service worker for offline support

---

## Security Measures

### Implemented
- HTTPS enforcement (production)
- CSRF protection (NextAuth)
- Input validation
- SQL injection prevention (Prisma)
- XSS protection

### Planned
- Rate limiting
- Content Security Policy
- Two-factor authentication
- Audit logging

---

## Contributing

This is a portfolio project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

This project is open source for educational purposes. Not for commercial use.

---

## Contact

**Developer**: Your Name  
**Email**: your.email@example.com  
**LinkedIn**: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)  
**GitHub**: [github.com/yourusername](https://github.com/yourusername)  
**Portfolio**: [yourportfolio.com](https://yourportfolio.com)

---

## Acknowledgments

- UI/UX inspiration from leading NFT marketplaces
- AI-generated artwork for demo purposes
- Open source community for excellent tools and libraries

---

**Built with care to showcase modern full-stack development** 
```

---

Now let me explain the architecture:

## Frontend Architecture Explanation

### 1. **Component Hierarchy**
```
App (Next.js 15 App Router)
│
├── Layout Components (Persistent)
│   ├── NavBar (always visible)
│   ├── Footer (always visible)
│   └── Providers (Context wrappers)
│
├── Page Components (Routes)
│   ├── Homepage (/)
│   ├── Explore (/explore)
│   ├── Create (/create)
│   └── Profile (/profile)
│
└── Feature Components
    ├── Modals (Login, Signup)
    ├── Carousels (Featured art)
    └── Sections (Statistics, Community)
```

### 2. **Data Flow**
```
User Action
    ↓
Component Event Handler
    ↓
Context API (if global state needed)
    ↓
API Route Call (fetch)
    ↓
Backend Processing
    ↓
Response
    ↓
State Update
    ↓
Re-render
```

### 3. **State Management**
- **Local State**: `useState` for component-specific data
- **Global State**: React Context for auth, modals
- **Server State**: NextAuth sessions
- **URL State**: Next.js router for navigation

---

## Future Backend Architecture

### 1. **Database Layer (PostgreSQL + Prisma)**
```
┌──────────────────────────────┐
│     Application Layer         │
│  (Next.js API Routes)         │
└──────────────┬────────────────┘
               │
               ↓
┌──────────────────────────────┐
│      Prisma ORM               │
│  - Type-safe queries          │
│  - Migrations                 │
│  - Schema validation          │
└──────────────┬────────────────┘
               │
               ↓
┌──────────────────────────────┐
│      PostgreSQL               │
│  - User data                  │
│  - Artwork metadata           │
│  - Transactions               │
└──────────────────────────────┘
```

### 2. **API Architecture**
```
Request Flow:
Client Request
    ↓
Middleware (Auth check)
    ↓
API Route Handler
    ↓
Business Logic Layer
    ↓
Prisma ORM
    ↓
PostgreSQL
    ↓
Response formatted
    ↓
Client receives data
```

### 3. **Blockchain Integration (Phase 3)**
```
Traditional DB          Blockchain
     │                      │
     ├─ User profiles       │
     ├─ Preferences         │
     └─ Analytics           │
                            │
                            ├─ NFT ownership
                            ├─ Transactions
                            └─ Smart contracts
```

### 4. **Microservices (Advanced)**
```
┌─────────────┐
│   Gateway   │
│  (Next.js)  │
└──────┬──────┘
       │
       ├─────→ Auth Service (NextAuth)
       ├─────→ User Service (Prisma)
       ├─────→ Artwork Service (Prisma + IPFS)
       ├─────→ Payment Service (Stripe)
       └─────→ Blockchain Service (ethers.js)