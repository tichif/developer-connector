const express = require('express');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = express.Router();

// @route   GET /api/profile/me
// @desc    get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'email']);

    if (!profile) {
      return res.status(401).send({
        errors: [
          {
            msg: 'There is no profile for this user.',
          },
        ],
      });
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
