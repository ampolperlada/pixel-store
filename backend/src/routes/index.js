import express from "express";
import nftRoutes from "./nftRoutes.js";

const router = express.Router();

router.use("/nfts", nftRoutes); // Now your API works at /api/nfts

export default router;