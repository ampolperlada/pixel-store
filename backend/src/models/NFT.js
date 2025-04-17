import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
  name: String,
  image: String,
  owner: String,
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

const NFT = mongoose.model("NFT", NFTSchema);
export default NFT;
