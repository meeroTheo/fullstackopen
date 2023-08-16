const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return "Blog list is empty";
  }
  // (fav, blog) -> fav is the end result (accumulator) that changes given conditions
  // blog is the current value
  // fav.likes > blog.likes ? fav : blog is the body of the function
  const favorite = blogs.reduce((fav, blog) =>
    fav.likes > blog.likes ? fav : blog
  );
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
