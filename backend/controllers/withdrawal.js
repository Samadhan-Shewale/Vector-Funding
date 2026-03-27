import { Withdrawal } from "../models/withdrawal.js";

export const getWithdrawal  =  async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const withdrawals = await Withdrawal.find({ userId: req.params.userId });
    res.json(withdrawals);
  } catch (error) {
    console.error('Fetch withdrawals error:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals', details: error.message });
  }
}

export const saveWithdrawal =  async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.accountId)) {
      return res.status(400).json({ error: 'Invalid account ID format' });
    }

    const withdrawal = new Withdrawal(req.body);
    await withdrawal.save();
    res.json(withdrawal);
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ error: 'Failed to create withdrawal', details: error.message });
  }
}