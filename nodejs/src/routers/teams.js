const Teams = require("../mongoose/models/teams");
const express = require("express");
const auth = require("../middlewares/auth");
const Players = require("../mongoose/models/players");

const teamsRouter = new express.Router();



//Registarion for a team
teamsRouter.post("/teams/registration", async (req, res) => {
  const team = new Teams(req.body);
  try {
    const token = await team.generateJWTTokens();
    res.status(201).send({ team, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//view all teams
teamsRouter.get("/teams/view", auth, async (req, res) => {
  try {
    const teams = await Teams.find();
    res.status(200).send(teams);
  } catch (e) {
    res.status(500).send(e);
  }
});

//logging in the user with credentials
teamsRouter.post("/teams/login", async (req, res) => {
  try {
    const team = await Teams.findByCredentials(
      req.body.name,
      req.body.password
    );
    if (!team) {
      throw new Error("Unable to login");
    }
    const token = await team.generateJWTTokens();
    res.send({ team, token });
  } catch (e) {
    res.status(400).send({ message:"Username or Password is wrong" });
  }
});

//updating the details of a team
teamsRouter.patch("/teams/update", auth, async (req, res) => {
  const id = req.team._id;
  const updates = Object.keys(req.body);
  const validUpdates = ["password", "coach"];
  const isValidUpdate = updates.every((update) =>
    validUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({"message":"Not a valid update"});
  }
  try {
    const team = await Teams.findById(id);
    updates.forEach((update) => (team[update] = req.body[update]));
    await team.save();
    res.send(team);
  } catch (e) {
    res.status(400).send();
  }
});

//getting the eleven from tha players list
teamsRouter.get("/teams/eleven", auth, async (req, res) => {
  try {
    const id = req.team._id;
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

//deleting the team from the DB
teamsRouter.delete("/teams/delete", auth, async (req, res) => {
  try {
    const id = req.team._id;
    const team = await Teams.findById(id);
    await team.remove();
    res.send({
      message:"Team is deleted successfully"}
      );
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = teamsRouter;
