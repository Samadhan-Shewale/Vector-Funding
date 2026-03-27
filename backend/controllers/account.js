import { Account } from "../models/account.js";

export const getAccounts =  async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please check your MONGODB_URI in settings.' });
    }
    const accounts = await Account.find({ userId: req.params.userId });
    res.json(accounts);
  } catch (error) {
    console.error('Fetch accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts', details: error.message });
  }
}

export const newAccount =  async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const account = new Account(req.body);
    await account.save();
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account', details: error.message });
  }
}

export const updateAccount = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid account ID format' });
    }
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(account);
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Failed to update account', details: error.message });
  }
}