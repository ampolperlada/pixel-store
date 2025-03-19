import React, { useState, useEffect } from 'react';

const AuthModals = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Toggle between login and signup
  const toggleAuth = () => {
    setGlitchEffect(true);
    setTimeout(() => {
      setIsLoginOpen(!isLoginOpen);
      setIsSignupOpen(!isSignupOpen);
      setGlitchEffect(false);
    }, 500);
  };

  // Random glitch effect interval
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, Math.random() * 5000 + 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // CRT scanline effect
  const ScanLines = () => (
    <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-black/5 to-transparent bg-repeat-y" 
         style={{ backgroundSize: '100% 2px' }}></div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className={`relative w-full max-w-md ${glitchEffect ? 'animate-pulse' : ''}`}>
        {/* Login Form */}
        {isLoginOpen && (
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-lg border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 relative overflow-hidden">
            <ScanLines />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
            
            <h2 className="text-3xl font-bold text-center mb-6 text-cyan-300 tracking-wide glitch-text">
              <span className="relative">
                <span className="absolute -top-1 -left-1 text-red-500 opacity-70">LOGIN</span>
                <span className="absolute -bottom-1 -right-1 text-blue-500 opacity-70">LOGIN</span>
                LOGIN
              </span>
            </h2>
            
            <form className="space-y-4 relative z-10">
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-1">USERNAME</label>
                <input 
                  type="text" 
                  className="w-full bg-indigo-900/50 text-white border border-cyan-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-1">PASSWORD</label>
                <input 
                  type="password" 
                  className="w-full bg-indigo-900/50 text-white border border-cyan-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input type="checkbox" className="border-cyan-500 rounded text-cyan-500" />
                  <label className="ml-2 text-cyan-300">Remember me</label>
                </div>
                <a href="#" className="text-cyan-300 hover:text-cyan-400">Forgot Password?</a>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
              >
                LOGIN
              </button>
            </form>
            
            <div className="mt-6 text-center text-cyan-300">
              <p>Don't have an account? <button onClick={toggleAuth} className="text-pink-400 hover:text-pink-300">Sign Up</button></p>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
          </div>
        )}
        
        {/* Signup Form */}
        {isSignupOpen && (
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-lg border-2 border-pink-400 shadow-lg shadow-pink-500/50 relative overflow-hidden">
            <ScanLines />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
            
            <h2 className="text-3xl font-bold text-center mb-6 text-pink-300 tracking-wide glitch-text">
              <span className="relative">
                <span className="absolute -top-1 -left-1 text-cyan-500 opacity-70">SIGN UP</span>
                <span className="absolute -bottom-1 -right-1 text-purple-500 opacity-70">SIGN UP</span>
                SIGN UP
              </span>
            </h2>
            
            <form className="space-y-4 relative z-10">
              <div>
                <label className="block text-pink-300 text-sm font-medium mb-1">USERNAME</label>
                <input 
                  type="text" 
                  className="w-full bg-indigo-900/50 text-white border border-pink-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              
              <div>
                <label className="block text-pink-300 text-sm font-medium mb-1">EMAIL</label>
                <input 
                  type="email" 
                  className="w-full bg-indigo-900/50 text-white border border-pink-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              
              <div>
                <label className="block text-pink-300 text-sm font-medium mb-1">PASSWORD</label>
                <input 
                  type="password" 
                  className="w-full bg-indigo-900/50 text-white border border-pink-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              
              <div>
                <label className="block text-pink-300 text-sm font-medium mb-1">CONFIRM PASSWORD</label>
                <input 
                  type="password" 
                  className="w-full bg-indigo-900/50 text-white border border-pink-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" className="border-pink-500 rounded text-pink-500" />
                <label className="ml-2 text-pink-300 text-sm">I agree to the Terms and Conditions</label>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-md hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-medium"
              >
                CREATE ACCOUNT
              </button>
            </form>
            
            <div className="mt-6 text-center text-pink-300">
              <p>Already have an account? <button onClick={toggleAuth} className="text-cyan-400 hover:text-cyan-300">Login</button></p>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
          </div>
        )}
        
        {/* Close button */}
        <button className="absolute -top-4 -right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 shadow-lg z-20">
          ✕
        </button>
        
        {/* Decorative pixel corners */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400"></div>
      </div>
    </div>
  );
};

export default AuthModals;