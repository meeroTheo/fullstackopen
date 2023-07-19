import { useState, useEffect } from "react"
import axios from 'axios'
import People from './components/People'
import SetFilter from './components/SetFilter'
import PersonForm from './components/PersonForm'
import Header from './components/Header'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNum, setNewNum] = useState("")
  const [showAll, setShowAll] = useState("")
  const [newFilter, setNewFilter] = useState("")

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const nameToShow = showAll
    ? persons
    : persons.filter((persons) =>
        persons.name.toLowerCase().match(newFilter.toLowerCase())
      )

  const addPerson = (event) => {
    event.preventDefault() //prevents submitting form
    if (newName.length === 0 || newNum.length === 0) {
      alert("Must enter both name and number")
    } else {
      const personObject = {
        name: newName,
        number: newNum
      }
      setPersons(persons.concat(personObject))
      setNewName("")
      setNewNum("")
    }
  }
  const handlePersonChange = (event) => {
    const inputValue = event.target.value
    if (persons.some((person) => person.name === inputValue)) {
      alert(`${inputValue} is already added to the phonebook`)
    } else {
      setNewName(inputValue)
    }
  }
  const handleNumberChange = (event) => {
    setNewNum(event.target.value)
  }
  const handleFilterChange = (event) => {
    const newFilter = event.target.value
    setNewFilter(newFilter)
    setShowAll(showAll)
  }

  return (
    <div>
      <Header title="Phonebook" />

      <SetFilter
        newFilter={newFilter}
        handleFilterChange={handleFilterChange}
        showAll={showAll}
        setShowAll={setShowAll}
      />

      <Header title="add a new" />

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNum={newNum}
        handleNumberChange={handleNumberChange}
      />

      <Header title="Numbers" />

      <People persons={nameToShow} />
    </div>
  )
}

export default App

