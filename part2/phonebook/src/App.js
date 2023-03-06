import { useState, useEffect } from 'react'

import Add from './components/Add'
import Filter from './components/Filter'
import List from './components/List'

import personService from './services/persons'

import './index.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='note'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        //console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    persons.some(person => person.name === newName)
    ? changeNumber(newName)
    : personService
      .create(personObject)
      .then(response => {
        setNotificationMessage(`Added ${newName}`)
        setTimeout(() => {setNotificationMessage(null)}, 5000)
        setPersons(persons.concat(response.data))
    })
    setNewName('')
    setNewNumber('')
  }
  
  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const searchResults = newSearch
  ? persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
  : persons

  const deleteName = (id) => {
    personService
      .remove(id)
    setPersons(persons.filter(person => person.id !== id))
  }

  const changeNumber = newName => {
    window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) 
    const person = persons.find(n => n.name === newName)
    const changedPerson = {...person, number: newNumber}
    personService
      .update(changedPerson.id, changedPerson)
      .then(() => {
        setPersons(persons.map(person => person.id !== changedPerson.id ? person : changedPerson))
        setNotificationMessage(`Changed ${newName}´s number to ${newNumber}`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(`Information of ${newName} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.filter(n => n.name !== newName))
      })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Error message={errorMessage} />
      <Notification message={notificationMessage} />
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange}  />

      <h3>add a new</h3>
      <Add addPerson={addPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} /> 
      
      <h3>Numbers</h3>
      <List searchResults={searchResults} deleteName={deleteName}/>

    </div>
  )
}

export default App
