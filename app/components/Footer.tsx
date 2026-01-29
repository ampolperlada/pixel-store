import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-400">Pixel Store</h3>
            <p className="text-gray-400 text-sm mb-4">
              The future of digital art. Built by creators, for creators.
            </p>
            <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
              BETA v1.0
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/explore" className="hover:text-white transition">Explore</Link></li>
              <li><Link href="/create" className="hover:text-white transition">Create</Link></li>
              <li><Link href="/trending" className="hover:text-white transition">Trending</Link></li>
              <li><Link href="/artists" className="hover:text-white transition">Artists</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/roadmap" className="hover:text-white transition">Roadmap</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/press" className="hover:text-white transition">Press Kit</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400 text-sm mb-4">
              <li><a href="https://twitter.com/pixelstore" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Twitter</a></li>
              <li><a href="https://discord.gg/pixelstore" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Discord</a></li>
              <li><a href="https://github.com/ampolperlada/pixel-store" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a></li>
              <li><a href="mailto:hello@pixelstore.art" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 Pixel Store. Built by <a href="https://github.com/ampolperlada" className="text-pink-400 hover:text-pink-300 transition" target="_blank" rel="noopener noreferrer">ampolperlada</a>
          </p>
          <div className="flex gap-6 text-gray-400 text-sm">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}