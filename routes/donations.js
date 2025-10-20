const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

// Donate to a campaign
router.post('/:campaignId', auth, async (req, res) => {
  const donation = new Donation({
    user: req.user.id,
    campaign: req.params.campaignId,
    amount: req.body.amount
  });
  await donation.save();
  res.json(donation);
});

// Get user's donations
router.get('/my', auth, async (req, res) => {
  const donations = await Donation.find({ user: req.user.id }).populate('campaign');
  res.json(donations);
});

module.exports = router;

