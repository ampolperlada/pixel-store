import express from 'express';
import NFT from "../models/NFT.js";

const router = express.Router();

// Create a new NFT
router.post("/", async (req, res) => {
    try {
      const nft = new NFT(req.body);
      await nft.save();
      res.status(201).json(nft);
    } catch (error) {
      res.status(500).json({ error: "Failed to create NFT" });
    }
  });
  
  // Get all NFTs


router.get("/", async (req, res) => {
     // Here you can add any logic you need, like querying a database
    try {
      const nfts = await NFT.find();
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NFTs" });
    }
  });


export default router;
