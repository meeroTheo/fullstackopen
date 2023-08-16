const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const initialBlogs = [
  {
    title: "titleName",
    author: "meer",
    url: "URLhere",
    likes: 5,
  },
  {
    title: "TEST",
    author: "TEST",
    url: "TEST",
    likes: 10,
  },
];
const newBlog = {
  title: "Go To Statement Considered Harmful",
  author: "Edsger W. Dijkstra",
  url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  likes: 5,
};

const normalUsers = [
  {
    username: "username1",
    name: "name1",
    password: "password1",
  },
  {
    username: "username2",
    name: "name2",
    password: "password2",
  },
  { username: "username3", name: "name3", password: "password3" },
];
const hashPasswords = (users) => {
  const saltRounds = 10;
  const clonedUsers = JSON.parse(JSON.stringify(users));

  const userWithHash = clonedUsers.map((user) => {
    const passwordHash = bcrypt.hashSync(user.password, saltRounds);
    user.passwordHash = passwordHash;
    delete user.password;
    return user;
  });
  return userWithHash;
};
const initialUsers = hashPasswords(normalUsers);

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  newBlog,
  initialUsers,
};
