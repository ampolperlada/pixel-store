// src/routes/gameRoutes.js
import express from 'express';
const router = express.Router();

// GET all games
router.get('/', async (req, res) => {
  try {
    res.status(200).json({ 
      message: 'Game routes working', 
      data: [
        { id: 1, name: 'Pixel Adventure', genre: 'Adventure' },
        { id: 2, name: 'Crypto Quest', genre: 'RPG' }
      ] 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json({ 
      message: `Game ${id} details`, 
      data: { 
        id: parseInt(id), 
        name: id === '1' ? 'Pixel Adventure' : 'Crypto Quest', 
        genre: id === '1' ? 'Adventure' : 'RPG',
        description: 'A blockchain-based game where players can earn NFTs.'
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create a new game
router.post('/', async (req, res) => {
  try {
    const gameData = req.body;
    res.status(201).json({ 
      message: 'Game created successfully', 
      data: { id: Math.floor(Math.random() * 1000), ...gameData } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;