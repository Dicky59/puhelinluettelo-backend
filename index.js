const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const Person = require('./models/person')

morgan.token('requestBody', function getRequestBody(req) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())  

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

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const content = `
      Phonebook has info for ${persons.length} people
      <br/><br/>
      ${new Date()}
    `
    res.send(content)
  })
})


app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }
  
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(409).json({
        error: "name is already in the phonebook"
    })
  }

  const person = {
    name : body.name,
    number : body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})