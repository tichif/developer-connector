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

// @route   GET /api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/:post_id
// @desc    Get single post by ID
// @access  Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Post not found',
          },
        ],
      });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        errors: [
          {
            msg: 'Post not found',
          },
        ],
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:post_id
// @desc    Remove a post by ID
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Post not found',
          },
        ],
      });
    }

    // check on the user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        errors: [
          {
            msg: 'Unauthorized action.',
          },
        ],
      });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        errors: [
          {
            msg: 'Post not found',
          },
        ],
      });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
