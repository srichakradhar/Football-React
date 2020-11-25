const Admin = require("../mongoose/models/admin");
const express = require("express");
const bcrypt = require("bcryptjs");
const adminauth = require("../middlewares/adminauth");
const Teams = require("../mongoose/models/teams");
const Players = require("../mongoose/models/players");

const adminRouter = express.Router();

//admin login
adminRouter.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.name,
      req.body.password
      );
    
    const token = await admin.generateJWTTokens();
    res.send({ admin, token });
 
  } catch (e) {
    res.status(400).send({ message:"Username or Password is wrong" });
  }
});

//view teams
adminRouter.get("/admin/teams/view",adminauth, async (req,res) => {
  
  try{
    const teams=await Teams.find();
    res.status(200).send(teams);
  }
  catch(e){
    res.status(500).send(e)
  }
  
});

//updating the team
adminRouter.patch("/admin/teams/update/:id", adminauth, async (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const validUpdates = ["name", "country", "coach"];
  const isValidUpdate = updates.every((update) =>
    validUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send("Not a valid update");
  }
  try {
    const team = await Teams.findById(id);
    updates.forEach((update) => (team[update] = req.body[update]));
    await team.save();
    res.send(team);
  } catch (e) {
    res.status(400).send(e);
  }
});

//deleting a team
adminRouter.delete("/admin/teams/delete/:id", adminauth, async (req, res) => {
  const id = req.params.id;
  try {
    const team = await Teams.findById(id);
    await team.remove();
    res.send({
      message:"Team is deleted successfully"});
  } catch (e) {
    res.status(400).send(e);
  }
});


//getting the eleven from tha players list
adminRouter.get("/admin/teams/eleven/:id", adminauth, async (req, res) => {
  try {
    const id = req.params.id;
    const FwdPlayers = await Players.find({
      belongsTo: id,
      inEleven: true,
      type: "Forwarder",
    });
    const MidFieldPlayers = await Players.find({
      belongsTo: id,
      inEleven: true,
      type: "Mid-Fielder",
    });
    const DefPlayers = await Players.find({
      belongsTo: id,
      inEleven: true,
      type: "Defender",
    });
    const GkPlayer = await Players.find({
      belongsTo: id,
      inEleven: true,
      type: "Goal Keeper",
    });
    const eleven = FwdPlayers.concat(MidFieldPlayers, DefPlayers, GkPlayer);
    if (
      FwdPlayers.length === 0 ||
      MidFieldPlayers.length === 0 ||
      DefPlayers.length === 0 ||
      GkPlayer.length !== 1 ||
      eleven.length !== 11
    ) {
      res.send({message:"Playing eleven does not meet the needed conditions",team11s:eleven})
    }else{
      res.send({message:"",team11s:eleven})
    }
    
    
    
  } catch (e) {
    res.status(400).send(e);
  }
});

//view players
adminRouter.get("/admin/players/view/:id", adminauth, async (req, res) => {
  try {
    const id = req.params.id;
    const players = await Players.find({ belongsTo: id });
    res.send(players);
  } catch (e) {
    res.status(400).send(e);
  }
});

//add players
adminRouter.post("/admin/players/register/:id", adminauth, async (req, res) => {
  const id = req.params.id;
  const player = new Players({
    ...req.body,
    belongsTo: id,
  });
  try {
    await player.save();
    res.status(201).send(player);
  } catch (e) {
    res.status(400).send(e);
  }
});

//updating a player
adminRouter.patch("/admin/players/update/:id", adminauth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const id = req.params.id;
    const player = await Players.findById(id);
    updates.forEach((update) => (player[update] = req.body[update]));
    await player.save();
    res.send(player);
  } catch (e) {
    res.status(400).send(e);
  }
});

//deleting a player
adminRouter.delete("/admin/players/delete/:id", adminauth, async (req, res) => {
  try {
    const id = req.params.id;
    await Players.findByIdAndDelete(id);
    res.send({message:" Player Deleted Successfully"});
  } catch (e) {
    res.status(400).send(e);
  }
     
});

//deleting all players
adminRouter.delete("/admin/players/deleteAll/:id", adminauth, async (req, res) => {
  try {
    await Players.deleteMany({ belongsTo: req.params.id });
    res.send({message:"All the players of the team were deleted successfully"});
  } catch (e) {
    res.status(400).send(e);
  }
});


module.exports = adminRouter;
