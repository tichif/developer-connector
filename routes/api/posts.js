const express = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a Post
// @access  Private
router.post(
  '/',
  [auth, [body('text', 'The content is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      if (!user) {
        return res.status(401).json({
          errors: [
            {
              msg: 'User not found',
            },
          ],
        });
      }

      const post = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const result = await post.save();

      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
