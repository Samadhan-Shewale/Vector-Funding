import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'active' },
  initialBalance: { type: Number, required: true },
  currentBalance: { type: Number, required: true },
  equity: { type: Number, required: true },
  maxDrawdown: { type: Number, required: true },
  dailyDrawdownLimit: { type: Number, required: true },
  profitTarget: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

export const Account = mongoose.model('Account', AccountSchema );
