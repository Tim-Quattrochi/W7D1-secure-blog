const express = require("express");
const router = express.Router();
const PostController = require("../controllers/posts");
const { verifyToken } = require("../controllers/auth");

// Create a new post
router.post("/", verifyToken, PostController.CreatePost);

// Delete a post by ID
router.delete("/:id", verifyToken, PostController.DeletePostById);

// Update a post by ID
router.put("/:id", verifyToken, PostController.UpdatePost);

// Get a post by ID
router.get("/:id", verifyToken, PostController.GetPostById);

// Get posts by user ID
router.get(
  "/user/:userId",
  verifyToken,
  PostController.GetPostByUserId
);

module.exports = router;
