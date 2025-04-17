// backend/src/controllers/trendingController.js
import TrendingCollection from '../models/TrendingCollection.js';

const trendingController = {
  async getTrending(req, res) {
    try {
      const period = req.query.period || '1d';
      
      // Validate period
      const validPeriods = ['1h', '1d', '7d', '30d'];
      if (!validPeriods.includes(period)) {
        return res.status(400).json({ error: 'Invalid period' });
      }
      
      // Get data from PostgreSQL (primary database)
      const collections = await TrendingCollection.getTrendingCollections(period);
      
      return res.json(collections);
    } catch (error) {
      console.error('Trending controller error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

export default trendingController;