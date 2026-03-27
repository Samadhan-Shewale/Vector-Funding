import { Trade } from "../models/trade.js";

export const getTrades  =  async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(req.params.accountId)) {
      return res.status(400).json({ error: 'Invalid account ID format' });
    }

    const trades = await Trade.find({ accountId: req.params.accountId }).sort({ openedAt: -1 });
    res.json(trades);
  } catch (error) {
    console.error('Fetch trades error:', error);
    res.status(500).json({ error: 'Failed to fetch trades', details: error.message });
  }
}


export const newTrade =  async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(req.body.accountId)) {
      return res.status(400).json({ error: 'Invalid account ID format' });
    }

    const trade = new Trade(req.body);
    await trade.save();
    res.json(trade);
  } catch (error) {
    console.error('Create trade error:', error);
    res.status(500).json({ error: 'Failed to create trade', details: error.message });
  }
}

export const updateTrade =  async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trade ID format' });
    }
    const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(trade);
  } catch (error) {
    console.error('Update trade error:', error);
    res.status(500).json({ error: 'Failed to update trade', details: error.message });
  }
}