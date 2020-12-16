const express = require("express");
const bcryptjs = require("bcryptjs");
const db = require("../data/dbconfig");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./jwtSecret");
const restricted = require("./restricted-middleware");
const router = express.Router();

const checkPayload = (req, res, next) => {
  // needs req.body to include username, password
  if (!req.body.username || !req.body.password) {
    res.status(401).json("bad payload");
  } else {
    next();
  }
};

const makeToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role,
      }
      const options = {
        expiresIn: '900s',
      }
      return jwt.sign(payload, jwtSecret, options)
}

router.get("/users", restricted, (req, res) => {
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
    department: req.body.department,
  };

  db("users")
    .insert(newUser)
    .then((data) => {
      res
        .status(200)
        .json({ message: `new user with an id of ${data} created` });
    })
    .catch((err) => {
      res.status(500).json({ error: err.code });
    });
});

router.post("/login", (req, res) => {
    console.log('loggin in')

    db("users").select("users.username", "users.password").where({ username: req.body.username }).then(([data]) => {
        if (data && bcryptjs.compareSync(req.body.password, data.password)) {
            const token = makeToken(data)
            res.status(200).json({
                message: "Welcome to our API, " + data.username,
                token,
            })
        }
    })
    
})

module.exports = router;
