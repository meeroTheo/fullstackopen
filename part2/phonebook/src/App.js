import { useState } from "react"

const Header = ({ title }) => {
  return <h2>{title}</h2>
}

const Names = ({ persons }) => {
  return (
    <div>
      {persons.map((person, i) => (
        <div key={i}>{persons[i].name}</div>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }])
  const [newName, setNewName] = useState("")

  const addPerson = (event) => {
    event.preventDefault() //prevents submitting form
    const personObject = {
      name: newName
    }
    setPersons(persons.concat(personObject))
    setNewName("")
  }
  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <Header title="Phonebook" />
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <Header title="Numbers" />
      <Names persons={persons} />
    </div>
  )
}

export default App

