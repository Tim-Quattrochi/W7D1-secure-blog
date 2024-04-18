const Post = require("../models/post");

// Class definition for the PostController
class PostController {
  // Method for creating a new post
  static async CreatePost(req, res, next) {
    try {
      // Destructuring title and description from the request body
      const { title, description } = req.body;

      // Checking if title or description is missing
      if (!title || !description)
        return res
          .status(400)
          .json("Please provide title and description");

      // Creating a new post with the provided title, user ID, and description
      const post = await Post.create({
        title,
        userId: req.user.id,
        description,
      });

      // Sending a success response with the created post
      res.status(200).json(post);
    } catch (error) {
      // Logging the error and passing it to the error handling middleware
      console.log(error);
      next(error);
    }
  }

  // Method for deleting a post by its ID
  static async DeletePostById(req, res, next) {
    try {
      // Extracting the post ID from the request parameters with object destructuring and renaming.
      const { id: postId } = req.params;

      const post = await Post.findByIdAndDelete(postId);

      if (!post) {
        return res
          .status(404)
          .json({ message: "No post found with this ID" });
      } else {
        return res.status(200).json({ "Post deleted:": post });
      }
    } catch (error) {
      // Logging the error and passing it to the error handling middleware
      console.log(error);
      next(error);
    }
  }

  // Method for updating a post by its ID
  static async UpdatePost(req, res, next) {
    try {
      // Extracting the post ID from the request parameters with object destructuring and renaming.
      const { id: postId } = req.params;

      const post = await Post.findByIdAndUpdate(postId, req.body, {
        new: true,
        runValidators: true,
      });

      // Sending a success response after successful update
      res.status(200).json({ "updated post": post });
    } catch (error) {
      // Logging the error and passing it to the error handling middleware
      console.log(error);
      next(error);
    }
  }

  // Method for getting a post by its ID
  static async GetPostById(req, res, next) {
    try {
      // Extracting the post ID from the request parameters
      const { id: postId } = req.params;

      // Implement retrieval logic here
      const post = await Post.findById(postId);
      if (!post) {
        return res
          .status(404)
          .json({ message: "No post found with this ID" });
      } else {
        // Sending a success response with the retrieved post
        return res.status(200).json({ "Post retrieved:": post });
      }
    } catch (error) {
      // Logging the error and passing it to the error handling middleware
      console.log(error);
      next(error);
    }
  }

  // Method for getting posts by a user's ID
  static async GetPostByUserId(req, res, next) {
    try {
      // Extracting the user ID from the request parameters
      const userId = req.params.userId;

      const postsByUser = await Post.find({ userId });

      if (!postsByUser) {
        return res
          .status(404)
          .json({ message: "No posts found for this user" });
      } else {
        // Sending a success response with the retrieved posts
        return res.status(200).json({ "Posts by user": postsByUser });
      }
    } catch (error) {
      // Logging the error and passing it to the error handling middleware
      console.log(error);
      next(error);
    }
  }
}

// Exporting the PostController class to be used by other modules
module.exports = PostController;
