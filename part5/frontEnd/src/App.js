import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  //empty array ensures that effect is executed only when component rendered for first time
  //updateBlogs
  const updateBlogs = async () => {
    const allBlogs = await blogService.getAll();
    setBlogs(allBlogs);
  };

  const addBlog = (title, url) => {
    blogFormRef.current.toggleVisibility();
    const newBlog = {
      title: title,
      author: user.name,
      url: url,
    };
    blogService.create(newBlog).then((response) => {
      setBlogs(blogs.concat(response));

      setSuccess(`a new blog ${newBlog.title} by ${newBlog.title} added`);
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      //if login successful, form fields emptied and server responds with token and user details
      //which is saved to the user field of the apps state
      const user = await loginService.login({ username, password });
      //save user credentials to local storage
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setError("wrong username or password");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };
  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };
  const blogList = () => {
    let sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
    return (
      <div>
        {sortedBlogs.map((blog) => (
          <Blog key={blog.id} initBlog={blog} updateBlog={updateBlogs} />
        ))}
      </div>
    );
  };
  const conRender = () => {
    //conditional render login form/blogs
    if (user === null) {
      return (
        <div>
          <h2>Log in to application</h2>
          <Notification success={success} error={error} />

          <LoginForm
            handleLogin={handleLogin}
            setUsername={setUsername}
            setPassword={setPassword}
            username={username}
            password={password}
          />
        </div>
      );
    } else {
      return (
        <div>
          <h2>blogs</h2>
          <Notification success={success} error={error} />
          {user && (
            <div>
              <p>
                {user.name} logged in{" "}
                <button onClick={handleLogout}>logout</button>
              </p>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>
            </div>
          )}
          {blogList()}
          {/* {blogs.map((blog) => (
            <Blog key={blog.id} initBlog={blog} updateBlogs={updateBlogs} />
          ))} */}
        </div>
      );
    }
  };

  return <div className="container">{conRender()}</div>;
};

export default App;
