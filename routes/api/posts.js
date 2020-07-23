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

// @route   PUT /api/posts/like/:post_id
// @desc    Like a post
// @access  Private
router.put('/like/:post_id', auth, async (req, res) => {
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

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
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

// @route   PUT /api/posts/unlike/:post_id
// @desc    Like a post
// @access  Private
router.put('/unlike/:post_id', auth, async (req, res) => {
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

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removedIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removedIndex, 1);

    await post.save();
    res.json(post.likes);
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

// @route   POST /api/posts/comments/:post_id
// @desc    Create comment to a specific post
// @access  Private
router.post(
  '/comments/:post_id',
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

      const comment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(comment);

      await post.save();

      res.send(post.comments);
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
  }
);

// @route   DELETE /api/posts/comments/:post_id/:comment:id
// @desc    Delete comment to a specific post
// @access  Private
router.delete('/comments/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    // Check if the posts exists
    if (!post) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Post not found',
          },
        ],
      });
    }

    // pull out comment
    const comment = post.comments.find(
      (comment) => comment.id.toString() === req.params.comment_id
    );

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Comment not found',
          },
        ],
      });
    }

    // Check if the user is the owner of the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        errors: [
          {
            msg: 'Unauthorized action',
          },
        ],
      });
    }

    // Find the index of the comment
    const removedIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removedIndex, 1);

    await post.save();

    res.json(post.comments);
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
