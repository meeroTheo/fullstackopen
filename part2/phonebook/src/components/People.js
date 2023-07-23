import React from "react";
import Person from "./Person";

const People = ({ persons, removePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.id} person={person} removePerson={removePerson} />
      ))}
    </div>
  );
};

export default People;
