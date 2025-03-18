import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create & Upload",
      description: "Design your pixel art and upload it to our marketplace",
      icon: "🎨"
    },
    {
      id: 2,
      title: "Set Your Terms",
      description: "Choose your pricing and royalty requirements",
      icon: "💰"
    },
    {
      id: 3,
      title: "Sell & Earn",
      description: "Collectors and game developers purchase your art",
      icon: "🛒"
    },
    {
      id: 4,
      title: "Game Integration",
      description: "See your art come to life in games across the ecosystem",
      icon: "🎮"
    }
  ];
  
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-2">How It Works</h2>
        <p className="text-center text-purple-300 mb-12">From creation to game integration in four simple steps</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative">
              <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center text-4xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">{step.title}</h3>
              <p className="text-gray-300 text-center">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 text-purple-500 text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;