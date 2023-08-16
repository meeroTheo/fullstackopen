const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }

  next(error);
};
//get token from the provided authorization header
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");

  request.token = null;
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};
// const userExtractor = (request, response, next) => {
//   console.log("token", request.token);
//   if (!request.token) {
//     console.log("No token found in request");
//     return response.status(401).json({ error: "Token missing" });
//   }
//   const decodedToken = jwt.verify(request.token, process.env.SECRET);

//   if (!request.token || !decodedToken.id) {
//     return response.status(401).json({ error: "token invalid" });
//   }
//   request.user = decodedToken.user;
//   next();
// };
module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
