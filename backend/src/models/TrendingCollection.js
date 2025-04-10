// backend/src/models/TrendingCollection.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// For MongoDB interactions
import mongoose from 'mongoose';

const TrendingCollection = {
  // PostgreSQL implementation using Prisma
  async getTrendingCollections(period) {
    try {
      // Using Prisma to query PostgreSQL
      return await prisma.collection.findMany({
        orderBy: {
          [`volume_${period}`]: 'desc',
        },
        take: 20,
        select: {
          id: true,
          name: true,
          floorPrice: true,
          [`floorChange_${period}`]: true,
          [`volume_${period}`]: true,
          [`volumeChange_${period}`]: true,
          totalItems: true,
          uniqueOwners: true,
          isVerified: true,
        },
      });
    } catch (error) {
      console.error('PostgreSQL query error:', error);
      return [];
    }
  },

  // MongoDB implementation (if you're using both databases)
  async getTrendingCollectionsFromMongo(period) {
    try {
      const periodMapping = {
        '1h': 'hourly',
        '1d': 'daily',
        '7d': 'weekly',
        '30d': 'monthly'
      };
      
      const mappedPeriod = periodMapping[period] || 'daily';
      
      // Using MongoDB native connection
      const collections = await mongoose.connection.collection('collections')
        .find({})
        .sort({ [`stats.${mappedPeriod}.volume`]: -1 })
        .limit(20)
        .toArray();
        
      // Transform to match expected format
      return collections.map(c => ({
        id: c._id.toString(),
        name: c.name,
        floorPrice: c.floorPrice,
        floorChange: c.stats[mappedPeriod].floorChange,
        volume: c.stats[mappedPeriod].volume,
        volumeChange: c.stats[mappedPeriod].volumeChange,
        items: c.totalItems,
        owners: c.uniqueOwners,
        isVerified: c.isVerified
      }));
    } catch (error) {
      console.error('MongoDB query error:', error);
      return [];
    }
  }
};

export default TrendingCollection;