const User = require("../models/user");

module.exports.users_get_all = (req, res, next) => {
  User.find()
    .select()
    .exec()
    .then((users) => {
      const response = {
        count: users.length,
        users: users,
      };
      res.status(200).end(JSON.stringify(response, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.users_get_user = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).end(JSON.stringify(user, null, 4));
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports.users_update_user = (req, res, next) => {
  let updateOps = {
    $set: {
      ...req.body,
    },
  };

  if (req.file) {
    updateOps.$set["userImage"] = req.file.path;
  }

  if (req.body.notifText) {
    updateOps = {
      $push: {
        notifications: {
          header: req.body.notifHeader,
          text: req.body.notifText,
        },
      },
    };
  }

  User.updateOne({ _id: req.params.userId }, updateOps)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User successfully updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.users_delete_user = (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User successfully deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.users_search_user = (req, res, next) => {
  let qUsername = req.query.q;
  let qLimit = Number(req.query.l);
  
  let re = new RegExp(qUsername, "g");
  

  User.find({ username: re })
    .limit(qLimit)
    .then((result) => {
      res.status(200).end(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
