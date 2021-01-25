const mongoose = require("mongoose");
const { update } = require("../models/post");
const Post = require("../models/post");
const User = require("../models/user");

module.exports.posts_get_all = (req, res, next) => {
  Post.find()
    .populate("author", "_id username name surname userImage")
    .exec()
    .then((docs) => {
      res.status(200).end(
        JSON.stringify(
          {
            count: docs.length,
            posts: docs,
          },
          null,
          4
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.posts_create_post = (req, res, next) => {
  User.findById(req.body.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        content: req.body.content,
        author: req.body.userId,
        postImage: req.file == null ? null : req.file.path,
        date: Date.now(),
      });

      return post.save().then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Post successfully created",
          createdPost: {
            post: result,
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.posts_get_post = (req, res, next) => {
  Post.findById(req.params.postId)
    .populate("author")
    .exec()
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      res.status(200).end(JSON.stringify(doc, null, 4));
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.posts_update_post = (req, res, next) => {
  let updateOps;

  if (req.body.comment) {
    updateOps = {
      $push: {
        comments: { username: req.body.username, comment: req.body.comment },
      },
    };
  } else if (req.body.likedUserId) {
    updateOps = {
      $push: {
        likes: { userId: req.body.likedUserId },
      },
    };
  } else if (req.body.userIdToDelete) {
    updateOps = {
      $pull: {
        likes: { userId: req.body.userIdToDelete },
      },
    };
  } else {
    updateOps = {
      $set: {
        ...req.body,
      },
    };
  }

  console.log(updateOps);

  Post.updateOne({ _id: req.params.postId }, updateOps)
    .exec()
    .then((result) => {
      if (result.n == 0) {
        return res.status(404).json({
          message: "Post does not exist",
        });
      }

      res.status(200).json({
        message: "Post successfully updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.posts_delete_post = (req, res, next) => {
  Post.findByIdAndDelete(req.params.postId)
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Post does not exist",
        });
      }
      res.status(200).json({
        message: "Post successfully deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
