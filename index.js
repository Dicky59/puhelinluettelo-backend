const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

morgan.token('requestBody', function getRequestBody(req) {
  return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody', {
  skip: function (req, res) { return req.method != 'POST' }
}))
app.use(morgan('tiny', {
  skip: function (req, res) { return req.method == 'POST' }
}))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  })
  .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const content = `Phonebook has info for ${persons.length} people
      <br/><br/>
      ${new Date()}`

    res.send(content)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(() => {response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})