import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  displayName: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

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

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

export const User = mongoose.model('User', UserSchema);
export const Account = mongoose.model('Account', AccountSchema);
export const Trade = mongoose.model('Trade', TradeSchema);
export const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);
