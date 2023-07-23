import { useState, useEffect } from "react";
import People from "./components/People";
import SetFilter from "./components/SetFilter";
import PersonForm from "./components/PersonForm";
import Header from "./components/Header";
import Notification from "./components/Notification";
import personService from "./services/persons";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [showAll, setShowAll] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notif, setNotif] = useState("");

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNum(event.target.value);
  };
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
    setShowAll(showAll);
  };
  const nameToShow = showAll
    ? persons
    : persons.filter((persons) =>
        persons.name?.toLowerCase().match(newFilter?.toLowerCase())
      );

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
      //console.log(response.data);
    });
  }, []);

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(pers=> id !== pers.id))
      });
    }
  };

  const addPerson = (event) => {
    event.preventDefault(); //prevents submitting form

    //if a # is added to an existing user, new number replaces old
    if (persons.some((person) => person.name === newName)) {
      const person = persons.find(pers => pers.name === newName);
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = {
          ...person,
          number: newNum
        }
        personService.update(person.id,updatedPerson).then((response) => {
          setPersons(persons.map(pers => pers.id !== response.id ? pers : response));
          
          setNotif(`${newName} successfully changed`);
          setTimeout(() => {
            setNotif(null);
          }, 5000);
        });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNum,
      };
      personService.create(personObject).then((response) => {
        setPersons(persons.concat(response.data));
        setNotif(`Added ${newName}`);
        setTimeout(() => {
          setNotif(null);
        }, 5000);
        setNewName("");
        setNewNum("");
      });
    }
  };

  return (
    <div>
      <Header title="Phonebook" />
      <SetFilter
        newFilter={newFilter}
        handleFilterChange={handleFilterChange}
        showAll={showAll}
        setShowAll={setShowAll}
      />
      <Notification message={notif} />
      <Header title="add a new" />
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNum={newNum}
        handleNumberChange={handleNumberChange}
      />
      <Header title="Numbers" />
      <People persons={nameToShow} removePerson={removePerson} />
    </div>
  );
};

export default App;
