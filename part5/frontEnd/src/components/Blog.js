import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ initBlog, updateBlogs }) => {
  const [showAll, setShowAll] = useState(false);
  const [likes, setLikes] = useState(initBlog.likes);
  const [blog, setBlog] = useState(initBlog); //initial

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    const putBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    const blogUpdate = await blogService.update(blog.id, putBlog);
    setLikes(blogUpdate.likes);
    setBlog(blogUpdate);
  };
  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id);
      updateBlogs();
    }
  };

  const titleAndAuthor = () => (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowAll(true)}>view</button>
    </div>
  );

  const displayBlog = () => (
    <div style={blogStyle}>
      {blog.title}
      <button onClick={() => setShowAll(false)}>hide</button>
      <br />
      {blog.url}
      <br />
      likes {likes}
      <button onClick={handleLike}>like</button>
      <br />
      {blog.author}
      <br />
      <button onClick={handleDelete}>remove</button>
    </div>
  );

  return (
    <div className="blog">{showAll ? displayBlog() : titleAndAuthor()}</div>
  );
};

export default Blog;
