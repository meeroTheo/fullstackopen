const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Blog = require("../models/blog");
const globals = {};
beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  //initialUsers
  const newUsers = helper.initialUsers.map((user) => new User(user));
  const userPromises = newUsers.map((user) => user.save());
  await Promise.all(userPromises);

  savedUsers = await helper.usersInDb();
  expect(savedUsers.length).toBeGreaterThan(1);

  const userForAllBlogs = {
    username: savedUsers[0].username,
    id: savedUsers[0].id,
  };

  const userForNoBlogs = {
    username: savedUsers[1].username,
    id: savedUsers[1].id,
  };
  //tokens
  const token = jwt.sign(userForAllBlogs, process.env.SECRET);
  const unauthorizedToken = jwt.sign(userForNoBlogs, process.env.SECRET);

  globals.token = `Bearer ${token}`;
  globals.tokenId = userForAllBlogs.id;
  globals.unauthorizedToken = `Bearer ${unauthorizedToken}`;

  //blogs
  const validUserId = savedUsers[0].id;
  const newBlogs = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: validUserId })
  );
  const blogsPromises = newBlogs.map((blog) => blog.save());
  await Promise.all(blogsPromises);
});

//LOGIN TESTING
//not included in requirements
describe("login testing", () => {
  test("valid login", async () => {
    const newUser = {
      username: "username1",
      password: "password1",
    };
    await api.post("/api/login").send(newUser).expect(200);
  });
  test("invalid login", async () => {
    const newUser = {
      username: "username1",
      password: "wrong",
    };
    await api.post("/api/login").send(newUser).expect(401);
  });
});

//USER TESTING

describe("test the users router", () => {
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "admin",
      name: "admin",
      password: "admin",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("invalid username length", async () => {
    const newUser = {
      username: "me",
      name: "MeerB",
      password: "123p",
    };
    await api.post("/api/users").send(newUser).expect(422);
  });

  test("get all users", async () => {
    response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

//BLOG TESTING
//GET TEST (RETRIEVE)
describe("retrieving blogs", () => {
  test("blogs returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("blogs have same length", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  test("identifier property is named id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });
  test("retrieve by id", async () => {
    blogsAtStart = await helper.blogsInDb();
    blog = blogsAtStart[0];

    const updated = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(updated.body.title).toBe(blog.title);
    expect(updated.body.url).toBe(blog.url);
  });
});
//POST TEST (CREATE)
describe("creating new blogs", () => {
  test("create a new blog post", async () => {
    await api
      .post("/api/blogs")
      .set("Content-Type", "application/json")
      .set("Authorization", globals.token)
      .send(helper.newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const title = blogsAtEnd.map((b) => b.title);
    expect(title).toContain("Go To Statement Considered Harmful");
  });

  test("blog without title is not added", async () => {
    const noTitle = {
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    };
    await api
      .post("/api/blogs")
      .set("Content-Type", "application/json")
      .set("Authorization", globals.token)
      .send(noTitle)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
  test("blog with undefined likes", async () => {
    const noLikes = {
      title: "testTitle",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };
    const response = await api
      .post("/api/blogs")
      .set("Content-Type", "application/json")
      .set("Authorization", globals.token)
      .send(noLikes)
      .expect(201);
    expect(response.body.likes).toBe(0);
  });
});
//DELETE AND PUT TEST (UPDATE)
describe("deleting and updating blog", () => {
  test("delete blog valid id", async () => {
    blogsAtStart = await helper.blogsInDb();
    blog = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set("Authorization", globals.token)
      .expect(204);
  });

  test("delete blog invalid id", async () => {
    blogsAtStart = await helper.blogsInDb();
    blog = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set("Authorization", globals.unauthorizedToken)
      .expect(401);
  });

  test("updating an existing blog", async () => {
    blogsAtStart = await helper.blogsInDb();
    blog = blogsAtStart[0];
    update = {
      title: "meer",
      author: "meer",
      url: "meer",
      likes: 100,
    };
    const updated = await api
      .put(`/api/blogs/${blog.id}`)
      .set("Authorization", globals.token)
      .set("Content-Type", "application/json")
      .send(update)
      .expect(200);

    expect(updated.body.title).toBe(update.title);
    expect(updated.body.url).toBe(update.url);
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});
