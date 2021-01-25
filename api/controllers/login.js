const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports.login_signup = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        return res.status(409).json({
          message: "Username already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              email: req.body.email,
              name: req.body.name,
              userImage: req.file == null ? null : req.file.path,
              birthday: req.body.birthday,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User successfully created",
                  createdUser: {
                    _id: result._id,
                    username: result.username,
                    password: result.password,
                    email: result.email,
                    name: result.name,
                    surname: result.surname,
                    userImage: result.userImage,
                    birthday: result.birthday,
                  },
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

module.exports.login_signin = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      bcrypt.compare(req.body.password, users[0].password, (err, same) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }

        if (same) {
          const token = jwt.sign(
            {
              username: users[0].username,
              userId: users[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }

        return res.status(401).json({
          message: "Auth failed",
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
