const express = require("express");
const router = express.Router();
const moment = require("moment");

const User = require("../models/user.model");
const Ad = require("../models/ad.model");

function canUserEdit(authUser, resUser) {
  console.log(resUser);
  if (authUser.id === resUser.id) {
    return true;
  }
  return false;
}

router.post("/", async (req, res, next) => {
  const addData = { ...req.body, date: moment().format("YYYY-MM-DD") };
  const ad = new Ad(addData);

  if (req.user) {
    ad.user = req.user;
    await ad.save();
    res.status(201).send(ad);
  }

  res.status(401).send();
});

router.get("/", async (req, res, next) => {
  let ads;
  let query = Object.assign({}, req.query);
  let username;
  
  try {
    if(req.query.username){
     username =  await User.find({username: req.query.username}).lean();
      delete query.username;

    }
    if (req.query.content) {
      delete query.content;
      ads = await Ad.find({
        content: { $regex: `${req.query.content}`, $options: "i" },
      }).find(query);

    } else {
      ads = await Ad.find(query).populate("user");
    }

    if(ads && req.query.username){
      ads = ads.filter(ad => {
        return ad.user.toString() == username[0]._id.toString();
      })
    }

    res.send(ads);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const ad = await Ad.findById(id).populate("user");
    res.send(ad);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    let body = { ...req.body, date: moment().format("YYYY-MM-DD") };

    const ad = await Ad.findByIdAndUpdate(id, body).populate("user");
    if (await canUserEdit(req.user, ad.user)) {
      res.send(ad);
    } else {
      res.status(400).send("AUTHORIZATION ERROR");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Ad.findByIdAndDelete(id);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
