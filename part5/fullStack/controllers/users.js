const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

const validateNewUser = (body) => {
  if (!body.username || !body.password) {
    return [400, { error: "username or password missing" }];
  }
  if (body.username.length < 3) {
    return [422, { error: "Username must be at least (3) characters" }];
  }
  if (body.password.length < 3) {
    return [422, { error: "Password must be at least (3) characters" }];
  }
  return;
};

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users.map((u) => u.toJSON()));
});

usersRouter.post("/", async (request, response) => {
  const validation = validateNewUser(request.body);
  if (validation) {
    return response.status(validation[0]).json(validation[1]);
  }
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});
module.exports = usersRouter;
