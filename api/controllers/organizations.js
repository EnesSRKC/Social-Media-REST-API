const Organization = require("../models/organization");
const User = require("../models/user");
const mongoose = require("mongoose");

module.exports.organizations_get_all = (req, res, next) => {
  Organization.find()
    .populate("owner", "_id username name email")
    .populate("participants", "name username email")
    .exec()
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

module.exports.organizations_create = (req, res, next) => {
  const organization = new Organization({
    _id: new mongoose.Types.ObjectId(),
    header: req.body.header,
    description: req.body.description,
    owner: req.body.userId,
    location: {
      name: req.body.locationName,
      lat: req.body.lat,
      long: req.body.long,
    },
    date: new Date(req.body.date),
    participants: [mongoose.Types.ObjectId(req.body.userId)],
    announcements: [],
  });

  return organization
    .save()
    .then((result) => {
      res.status(201).end(
        JSON.stringify({
          message: "Organization succesfully created",
          createdOrganization: result,
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

module.exports.organizations_get_user_organizations = (req, res, next) => {
  Organization.find({ participants: req.params.userId })
    .populate("owner", "_id username name email")
    .populate("participants", "name username email")
    .exec()
    .then((result) => {
      res.status(200).end(JSON.stringify(result, null, 4));
    })
    .catch((err) => res.status(500).json(err));
};

module.exports.organizations_update_organization = (req, res, next) => {
  let updateOps;

  if (req.body.userId) {
    updateOps = {
      $push: {
        participants:  mongoose.Types.ObjectId(req.body.userId),
      },
    };
  }

  if (req.body.header) {
    updateOps = {
      $push: {
        announcements: {
          header: req.body.header,
          content: req.body.content,
          date: Date.now(),
        },
      },
    };
  }

  Organization.updateOne({ _id: req.params.orgId }, updateOps)
    .exec()
    .then((result) => {
      if (result.n == 0) {
        return res.status(404).json({
          message: "Organization does not exist",
        });
      }

      res.status(200).json({
        message: "Organization successfully updated",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

