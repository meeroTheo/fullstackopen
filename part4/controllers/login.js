const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

//essentially returns a token that is used to verify a user
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  // looks for username attached to request
  const user = await User.findOne({ username });
  //checks if the password is correct
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }
  //token createad if password is correct
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  //log out after 1 hour
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});
module.exports = loginRouter;
