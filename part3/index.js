require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
//const mongoose = require('mongoose')
const Phonebook = require('./models/phonebook')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', function (req) { return JSON.stringify(req.body, ['name', 'number']) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//const password = '******' 

//const url =
//  `mongodb+srv://dbuser:${password}@cluster0.2ucfl6t.mongodb.net/?retryWrites=true&w=majority`

//mongoose.set('strictQuery',false)
//mongoose.connect(url)

//const phonebookSchema = new mongoose.Schema({
//  name: String,
//  number: String,
//})

//const Phonebook = mongoose.model('Phonebook', phonebookSchema)

//phonebookSchema.set('toJSON', {
//  transform: (document, returnedObject) => {
//    returnedObject.id = returnedObject._id.toString()
//    delete returnedObject._id
//    delete returnedObject.__v
//  }
//})


//let persons = [
//  { 
//    "id": 1,
//    "name": "Arto Hellas", 
//    "number": "040-123456"
//  },
//  { 
//    "id": 2,
//    "name": "Ada Lovelace", 
//    "number": "39-44-5323523"
//  },
//  { 
//    "id": 3,
//    "name": "Dan Abramov", 
//    "number": "12-43-234345"
//  },
//  { 
//    "id": 4,
//    "name": "Mary Poppendieck", 
//    "number": "39-23-6423122"
//  }
//]

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }
  const entry = new Phonebook({
    name: body.name,
    number: body.number,
  })
  entry.save().then(savedEntry => {
    response.json(savedEntry)
  })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const entry = {
    name: body.name,
    number: body.number,
  }
  Phonebook.findByIdAndUpdate(request.params.id, entry, { new: true })
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id).then(entry => {
    if (entry) {
      response.json(entry)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

//app.get('/api/persons/:id', (request, response) => {
//    const id = Number(request.params.id)
//    const person = persons.find(person => person.id === id)
//    if (person) {
//        response.json(person)
//      } else {
//        response.status(404).end()
//      }
//    })

//app.post('/api/persons', (request, response) => {
//    const id = Math.floor(Math.random()*10000 + 5)
//    const person = request.body
//    if (!person.name) {
//        return response.status(400).json({ 
//          error: 'name missing' 
//        })
//      }
//    if (!person.number) {
//    return response.status(400).json({ 
//        error: 'number missing' 
//        })
//    }
//    if (persons.find(element => element.name === person.name)) {
//        return response.status(400).json({ 
//            error: 'name must be unique' 
//        })
//    }
//    person.id = id
//    persons = persons.concat(person)
//    response.json(person)
//    })

//app.delete('/api/persons/:id', (request, response) => {
//    const id = Number(request.params.id)
//    persons = persons.filter(person => person.id !== id)
//    response.status(204).end()
//    })

app.get('/info', (request, response) => {
  Phonebook.countDocuments().then(result => {
    const entries = result.toString()
    const now = Date().toString()
    response.send(`<p>Phonebook has info for ${entries} people</p>${now}<p>`)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})