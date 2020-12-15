const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../data/dbconfig");
const router = express.Router();

const checkPayload = (req, res, next) => {
    // needs req.body to include username, password
    if (!req.body.username || !req.body.password) {
      res.status(401).json("bad payload");
    } else {
      next();
    }
  };

router.get("/users", (req, res) => {
    db("users")
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  });

  router.post("/register", checkPayload, (req, res) => {
    console.log("registering");
    const hash = bcrypt.hashSync(req.body.password, 10);
  
    const newUser = {
      username: req.body.username,
      password: hash,
      department: req.body.department
    };
  
    db("users")
      .insert(newUser)
      .then((data) => {
        res.status(200).json({ message: `new user with an id of ${data} created`});
      })
      .catch((err) => {
        res.status(500).json({ error: err.code });
      });
  });
  

module.exports = router;
