const mongoose = require("mongoose");
const Message = require("../models/message");

module.exports.messages_get_all = (req, res, next) => {
  Message.find()
    .exec()
    .then((docs) => {
      res.status(200).end(JSON.stringify(docs, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.messages_get_message = (req, res, next) => {
  let username = req.params.username;

  Message.find({ $or: [{ from: username }, { to: username }] })
    .then((docs) => {
      res.status(200).end(JSON.stringify(docs, null, 4));
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.messages_create_message = (req, res, next) => {
  const message = new Message({
    _id: new mongoose.Types.ObjectId(),
    from: req.body.sender,
    to: req.body.receiver,
    messages: [
      {
        username: req.body.sender,
        message: req.body.message,
        date: Date.now(),
      },
    ],
  });

  message
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).end(
        JSON.stringify({
          message: "Message successfully created",
          createdMessage: result,
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.messages_add_message = (req, res, next) => {

  let addedMesage = {
    username: req.body.username,
    message: req.body.message,
    date: Date.now(),
  };
  let updateOps = {
    $push: {
      messages: addedMesage,
    },
  };

  Message.updateOne({ _id: req.params.messageId }, updateOps)
    .then((result) => {
      if (result.n == 0) {
        return res.status(404).json({
          message: "Message object does not exist",
        });
      }

      res.status(200).json({
        message: "Message successfully sent",
        addedMessage: addedMesage
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
