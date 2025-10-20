const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

// Get user profile
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  const donations = await Donation.find({ user: req.user.id }).populate('campaign');
  res.json({ user, donations });
});

module.exports = router;