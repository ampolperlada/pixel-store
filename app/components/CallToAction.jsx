export default function CallToAction() {
  return (
    <div className="py-20 px-6 bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-y border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Join the Revolution?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Whether you're an artist ready to monetize your work or a collector looking for the next big thing, Pixel Store is your gateway to the digital art economy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/signup" 
            className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            Get Started Free
            <span>→</span>
          </a>
          <a 
            href="/explore" 
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg transition-all border border-white/20"
          >
            Explore Marketplace
          </a>
        </div>
        <p className="text-gray-400 text-sm mt-6">
          Join 10,000+ creators and collectors • No hidden fees • Creator-first platform
        </p>
      </div>
    </div>
  );
}