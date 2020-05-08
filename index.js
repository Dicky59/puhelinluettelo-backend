const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

morgan.token('requestBody', function getRequestBody(req) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(express.static('build'))  

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody', {
  skip: function (req, res) { return req.method != 'POST' }
}))
app.use(morgan('tiny', {
  skip: function (req, res) { return req.method == 'POST' }
}))

let persons = [
  {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
  },
  {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
  },
  {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
  },
  {
    name: "Ripa Risukasa",
    number: "39-23-777 888",
    id: 4
  },
  {
    name: "Pate Patukas",
    number: "040-777-777",
    id: 5
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.get("/info", (req, res) => {
  res.send([
      `<p>Phonebook has info for ${persons.length} people</p>`,
      `<p>${new Date()}</p>`
  ].join("\n"))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const generateId = () => (Math.floor(Math.random() * 100))

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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})