const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const auth = require('../middleware/auth');

// Get all campaigns
router.get('/', async (req, res) => {
  const campaigns = await Campaign.find();
  res.json(campaigns);
});

// Create campaign (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const campaign = new Campaign(req.body);
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

