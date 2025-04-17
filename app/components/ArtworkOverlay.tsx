import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Button from "../components/ui/button";
import { X } from "lucide-react";

export default function ArtworkOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="mt-4">
        More Info
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 bg-opacity-50 fixed inset-0" onClick={() => setIsOpen(false)}></div>
        <div className="bg-gray-800 text-white max-w-lg w-full rounded-lg shadow-lg p-6 relative animate-fade-in">
          <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-blue-400">Ariza, the Masked Warrior</h2>
          <p className="mt-2 text-gray-300">Holds the fate of a lost kingdom.</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2"><span className="text-blue-400">⚔️</span> Part of the Forgotten Legends universe!</li>
            <li className="flex items-center gap-2"><span className="text-blue-400">🏹</span> Every piece tells a story – collect them all!</li>
            <li className="flex items-center gap-2"><span className="text-blue-400">🔄</span> NFT-ready: Easily integrate into digital galleries.</li>
            <li className="flex items-center gap-2"><span className="text-blue-400">📌</span> Need a print version? We offer premium canvas prints!</li>
            <li className="flex items-center gap-2"><span className="text-blue-400">💬</span> Join our Discord to see new art first!</li>
          </ul>
        </div>
      </Dialog>
    </>
  );
}
