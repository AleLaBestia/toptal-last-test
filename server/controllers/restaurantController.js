const Restaurant = require("../models/restaurant");
const Review = require("../models/review");
const User = require("../models/user");
const ObjectId = require("mongodb").ObjectID;
const _ = require("lodash");

async function post(req, res, next) {
  try {
    let { name = "", user: reqUser = null } = req.body || {};
    const { user } = req;

    if (!name) {
      return res.status(400).send({
        message: "Name is required."
      });
    }

    if (user.role === "regular" || user.role === "admin") {
      return res.status(403).send({
        message: "You're not authorized to create a restaurant."
      });
    }

    const rest = await Restaurant.findOne({ name });
    if (rest) {
      return res.status(409).send({
        message: "Restaurant already exists with same name."
      });
    }

    if (!ObjectId.isValid(reqUser) && user.role === "admin") {
      return res.status(422).send({
        message: "User ID is not valid id."
      });
    }

    const existUser = await User.findOne({
      _id: ObjectId(reqUser),
      role: "owner"
    });

    if (!existUser && user.role === "admin") {
      return res
        .status(422)
        .send({ message: "Restaurant is authorized to only owners" });
    }

    const restaurant = await Restaurant.create({
      name: name,
      user: user.role === "admin" ? ObjectId(reqUser) : user,
      overall_rating: 0,
      highest_rating: 0,
      lowest_rating: 0,
      reviews: []
    });

    return res.status(201).send({ restaurant });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    let { min = 0, max = 5, page = 1, pageSize = 5 } = req.query;

    if (
      !_.isInteger(_.toNumber(page)) ||
      !_.isInteger(_.toNumber(pageSize)) ||
      _.toNumber(page) <= 0 ||
      _.toNumber(pageSize) <= 0
    ) {
      return res
        .status(422)
        .send({ message: "Page and Page Size must be positive integer." });
    }

    const { user } = req;
    if (min > max) {
      res.status(400).send({
        message: "Max value should be more than min value."
      });
      return;
    }

    let where = {};
    where["overall_rating"] = { $gte: min, $lte: max };
    if (user.role === "owner") {
      where["user"] = ObjectId(user._id);
    }
    const count = await Restaurant.countDocuments(where);

    let restaurants;
    if (user.role === "owner") {
      restaurants = await Restaurant.find({
        overall_rating: { $gte: min, $lte: max },
        user: user._id
      })
        .skip(parseInt(page - 1) * parseInt(pageSize))
        .limit(parseInt(pageSize))
        .populate("user", "-password -passwordConfirm")
        .sort([["overall_rating", -1]])
        .exec();
    } else {
      restaurants = await Restaurant.find({
        overall_rating: { $gte: min, $lte: max }
      })
        .skip(parseInt(page - 1) * parseInt(pageSize))
        .limit(parseInt(pageSize))
        .populate("user", "-password -passwordConfirm")
        .sort([["overall_rating", -1]])
        .exec();
    }

    return res.send({
      restaurants,
      count
    });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const { name = "", user } = req.body;
    const { user: reqUser } = req;

    if (reqUser.role === "regular")
      return res
        .status(403)
        .send({ message: "You are not authorized to update restaruant" });

    let restaurant = await Restaurant.findOne({ _id: id });
    if (!restaurant) {
      return res.status(400).send({
        message: "Restaurant doesn't exist."
      });
    }

    if (
      reqUser.role === "owner" &&
      reqUser._id !== restaurant["user"].toString()
    ) {
      return res.status(403).send({
        message: "You are not aurthorized to update another owner's restaurant."
      });
    }

    if (!name) {
      return res.status(400).send({
        message: "Restaurant name is required."
      });
    }

    if (!user && reqUser.role === "admin") {
      return res.status(400).send({
        message: "User is required."
      });
    }

    if (!ObjectId.isValid(user) && reqUser.role === "admin") {
      return res.status(422).send({
        message: "User ID is not valid id."
      });
    }

    const existUser = await User.findOne({ _id: user, role: "owner" });
    if (!existUser && reqUser.role === "admin") {
      return res
        .status(409)
        .send({ message: "Restaurant is authorized to only owners" });
    }

    // await Restaurant.findOne({ _id: id }, async (err, restaurant) => {
    //   restaurant.name = name;
    //   if(user) restaurant.user = user;
    //   await restaurant.save();
    //   return res.send({
    //     restaurant: restaurant
    //   });
    // });

    restaurant.name = name;
    if (user) restaurant.user = user;
    await restaurant.save();
    return res.send({
      restaurant: restaurant
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    const user = req.user;

    if (user.role === "regular") {
      return res.status(403).send({
        message: "You're not authroized to remove the restaurant."
      });
    }

    const restaurant = await Restaurant.findOne({ _id: id });
    if (!restaurant) {
      return res.status(400).send({
        message: "Restaurant doesn't exist."
      });
    }

    if (user.role === "owner" && user._id !== restaurant["user"].toString()) {
      return res.status(403).send({
        message: "You can not remove another owner's restaurant."
      });
    }

    await Review.deleteMany({ restaurant: id });
    const remove = await Restaurant.deleteOne({ _id: id });
    return res.send({
      result: remove
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  post,
  list,
  update,
  remove
};
