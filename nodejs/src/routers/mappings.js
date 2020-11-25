const express = require("express");
const adminauth = require("../middlewares/adminauth");
const Mappings = require("../mongoose/models/mappings");
const mappingRouter = new express.Router();

//adding mapping to db. do before run
mappingRouter.post("/mapping/add", adminauth, async (req, res) => {
  const maps = new Mappings({
    category: req.body.category,
    name: req.body.name,
  });
  try {
    await maps.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

//viewing mappings
mappingRouter.get("/mapping/view", async (req,res) => {
    
  try {
    const maps = await Mappings.find();
    res.status(200).send(maps);
  } catch (e) {
    res.status(400).send(e);
  }
      
});

//updating mappings
mappingRouter.patch("/mapping/update/:id", adminauth, async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  try {
    await Mappings.findByIdAndUpdate(id, { name });
    res.send();
  } catch (e) {
    res.status(400).send(e);
    console.log("error");
  }
});

module.exports = mappingRouter;
