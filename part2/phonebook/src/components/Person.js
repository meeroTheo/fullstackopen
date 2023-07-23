import React from "react";

const Person = ({ person, removePerson }) => {
  return (
    <div className="person" key={person.name}>
      {person.name} {person.number}
      <button onClick={() => removePerson(person.id, person.name)}>
        Delete
      </button>
    </div>
  );
};
export default Person;
