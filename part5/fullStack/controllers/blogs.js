blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;
  // console.log(request.token);
  //verify if the token is valid or not
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  const user = await User.findById(decodedToken.id);

  if (!body.title || !body.url)
    return response.status(400).json({ error: "title or url missing" });
  // Retrieve the first user from the database
  //const user = await User.findOne();
  if (!user) {
    return response
      .status(500)
      .json({ error: "No users found in the database" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes | 0,
    user: user.id,
  });
  //Since express-async-errors, no need for try-catch
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog.toJSON());
});

blogRouter.delete("/:id", async (request, response) => {
  const { token } = request;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).end();

  const belongToUser = blog.user.toString() === decodedToken.id;

  if (belongToUser) {
    await Blog.findByIdAndRemove(request.params.id);
    return response.status(204).end();
  }
  return response
    .status(401)
    .json({ error: "User is not permitted to modify this item" });
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog.toJSON());
});
module.exports = blogRouter;
