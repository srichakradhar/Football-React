const express = require("express");
const Players = require("../mongoose/models/players");
const auth = require("../middlewares/auth");

const playersRouter = new express.Router();

//creating a player
playersRouter.post("/players/register", auth, async (req, res) => {
  const player = new Players({
    ...req.body,
    belongsTo: req.team._id,
  });
  try {
    await player.save();
    res.status(201).send(player);
  } catch (e) {
    res.status(400).send();
  }
});

//view players of a team
playersRouter.get("/players/view", auth, async (req, res) => {
  try {
    if (!req.query.type) {
      const players = await Players.find({ belongsTo: req.team._id });
      res.send(players);
    }
    if (req.query.type === "Forwarder") {
      const players = await Players.find({
        belongsTo: req.team._id,
        type: "Forwarder",
      });
      res.send(players);
    }
    if (req.query.type === "Defender") {
      const players = await Players.find({
        belongsTo: req.team._id,
        type: "Defender",
      });
      res.send(players);
    }
    if (req.query.type === "Mid Fielder") {
      const players = await Players.find({
        belongsTo: req.team._id,
        type: "Mid Fielder",
      });
      res.send(players);
    }
    if (req.query.type === "Goal Keeper") {
      const players = await Players.find({
        belongsTo: req.team._id,
        type: "Goal Keeper",
      });
      res.send(players);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

//updating a player
playersRouter.patch("/players/update/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  
  try {
    const player = await Players.findOne({ belongsTo: req.team._id, _id: req.params.id,});
    updates.forEach((update) => (player[update] = req.body[update]));
    await player.save();
    res.send(player);
  } catch (e) {
    res.status(400).send(e);
  }
});

//deleting a player
playersRouter.delete("/players/delete/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const player = await Players.findOne({ _id: id,belongsTo: req.team._id });
    await player.remove();
    res.send({message:"Player Deleted Successfully"});
  } catch (e) {
    res.status(400).send(e);
  }
});

//deleting all players of a team
playersRouter.delete("/players/deleteAll", auth, async (req, res) => {
  try {
    await Players.deleteMany({ belongsTo: req.team._id });
    res.send({"message":"All the players of the team were deleted successfully"});
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = playersRouter;
