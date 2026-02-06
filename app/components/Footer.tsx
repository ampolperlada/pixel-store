import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Demo Disclaimer Section */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">
              Portfolio Demonstration Project
            </h3>
            <p className="text-gray-300 text-sm mb-3 max-w-3xl mx-auto">
              <strong className="text-white">Pixel Forge</strong> is a full-stack web application built to showcase modern development practices and UI/UX design capabilities.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400 mb-3">
              <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">Next.js 15</span>
              <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">TypeScript</span>
              <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">Prisma ORM</span>
              <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">NextAuth.js</span>
              <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">PostgreSQL</span>
              <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">MetaMask Integration</span>
              <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">TailwindCSS</span>
            </div>
            <p className="text-gray-500 text-xs">
              All artwork generated via AI for demonstration purposes • Not for commercial use
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-400">Pixel Forge</h3>
            <p className="text-gray-400 text-sm mb-4">
              A full-stack NFT marketplace demo. Built to showcase modern web development.
            </p>
            <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
              DEMO v1.0
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/explore" className="hover:text-white transition">Explore</Link></li>
              <li><Link href="/create" className="hover:text-white transition">Create</Link></li>
              <li><Link href="/games" className="hover:text-white transition">Games</Link></li>
              <li><Link href="/learn" className="hover:text-white transition">Learn</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="https://github.com/ampolperlada" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">View Source Code</a></li>
              <li><Link href="/waitlist" className="hover:text-white transition">Join Waitlist (Demo)</Link></li>
              <li><a href="https://github.com/ampolperlada" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Documentation</a></li>
              <li><a href="https://github.com/ampolperlada" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Tech Stack</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400 text-sm mb-4">
              <li><a href="https://github.com/ampolperlada" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/christian-paul-perlada/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a></li>
              <li><a href="mailto:christianp.perlada@gmail.com" className="hover:text-white transition">Email</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © 2024 Pixel Forge - Demo Portfolio Project
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Built by <a href="https://github.com/ampolperlada" className="text-cyan-400 hover:text-cyan-300 transition" target="_blank" rel="noopener noreferrer">Christian Perlada</a> • Not for commercial use
            </p>
          </div>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="https://github.com/ampolperlada" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Source Code
            </a>
            <a href="https://github.com/ampolperlada" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              About Project
            </a>
            <a href="https://www.linkedin.com/in/christian-paul-perlada/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}