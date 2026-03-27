import { mongoose } from "mongoose";

const TradeSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  userId: { type: String, required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  entryPrice: { type: Number, required: true },
  exitPrice: Number,
  lots: { type: Number, required: true },
  profit: Number,
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  openedAt: { type: Date, default: Date.now },
  closedAt: Date,
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

export const Trade = mongoose.model('Trade', TradeSchema );