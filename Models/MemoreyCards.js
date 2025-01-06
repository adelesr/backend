import mongoose from "mongoose";

const memoryCardSchema = new mongoose.Schema({
    imgSrc: {type: String, required: true},
    isSelected: {type: Boolean, default: false}
});

const MemoryCard = mongoose.model("MemoryCards", memoryCardSchema); 
export default MemoryCard;