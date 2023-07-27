require('dotenv').config({path:'process.env'});
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const Person = require("./models/person"); //constructor for making person objects

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

//morgan token is a string (we show the data sent in the HTTP POST req)
morgan.token("payload", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :payload"
  )
);

//getting all persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});
//Add (post) someone to the database
app.post("/api/persons", (req, res) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((perFormatted) => res.json(perFormatted));
});
//getting info
app.get("/api/info", (req, res) => {
  const requestTime = new Date(Date.now());
  Person.find({}).then((persons) => {
    persons.map((person) => person.toJSON());
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p> <p>${requestTime}<p>`
    );
  });
});
//getting single person
app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});
//delete a single person
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});
//if a number exists for someone already in the phonebook, update the number
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };
  //{new: true} checks the person object for whats the same and whats new
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedNum) => {
      response.json(updatedNum.toJSON());
    })
    .catch((error) => next(error));
});

//error handling
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);
//PORT and server running info
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
