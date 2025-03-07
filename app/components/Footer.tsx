// src/components/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-black text-cyan-400 py-4 px-6 flex justify-between items-center shadow-lg border-b border-cyan-400">
      <h1 className="text-2xl font-mono tracking-widest">Pixel Store</h1>
      <nav>
        <ul className="flex space-x-6">
          <li><a href="#" className="hover:text-cyan-200">Home</a></li>
          <li><a href="#" className="hover:text-cyan-200">Shop</a></li>
          <li><a href="#" className="hover:text-cyan-200">About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-cyan-400 py-4 text-center border-t border-cyan-400 mt-10">
      <p className="text-sm font-mono">&copy; 2025 Pixel Store. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
