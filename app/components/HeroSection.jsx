import React, { useState, useEffect } from 'react';

export default function HeroSection() {
  const [hoveredTile, setHoveredTile] = useState(null);
  const [rockets, setRockets] = useState([]);

  // Generate flying rockets periodically
  useEffect(() => {
    const spawnRocket = () => {
      const newRocket = {
        id: Math.random(),
        x: -50,
        y: Math.random() * 400,
        speed: 2 + Math.random() * 3,
        trail: []
      };
      setRockets(prev => [...prev, newRocket]);
    };

    const interval = setInterval(spawnRocket, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate rockets
  useEffect(() => {
    const animateRockets = () => {
      setRockets(prev => prev
        .map(rocket => ({
          ...rocket,
          x: rocket.x + rocket.speed,
          trail: [...rocket.trail.slice(-8), { x: rocket.x, y: rocket.y }]
        }))
        .filter(rocket => rocket.x < window.innerWidth + 100)
      );
    };

    const animationFrame = setInterval(animateRockets, 50);
    return () => clearInterval(animationFrame);
  }, []);

  const getTileColor = (index) => {
    if (hoveredTile === index) {
      const col