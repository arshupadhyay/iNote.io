const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Anystringtosharewhilesigning";
//ROUTE1: Create a User using : POST "/api/auth/createuser". Doesn't require Authen...
router.post(
  "/createuser",
  [
    body("name", "Name Invalid").isLength({ min: 3 }),
    body("email", "Email Invalid").isEmail(),
    body("password", "Increse the size of password 5<").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success ,errors: errors.array() });
    }
    //Check whether the user with the same email exists already
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({ success,error: "User email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      // res.json(user);
      success = true;
      res.json({ success,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Something went wrong");
    }
  }
);

//ROUTE2: Authenticate the user using : POST "/api/auth/login" No login required
router.post(
  "/login",
  [
    body("email", "Email Invalid").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => 
  {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try 
    {
      let user = await User.findOne({ email });
      if (!user) 
      {
        success = false;
        return res.status(400).json({ error: "Incorrect credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) 
      {
        success=false;
        return res.status(400).json({ error: "Incorrect credentials" });
      }
      const data =
      {
        user: 
        {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true,
      res.json({ success,authtoken });
    } 
    catch (error) 
    {
      console.error(error.message);
      res.status(500).send("Something went wrong!!!");
    }
  }
);

// ROUTE3: Get loggedin user details : POST "/api/auth/getuser" Login required
router.post("/getuser",fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong!!!");
  }
});

module.exports = router;
