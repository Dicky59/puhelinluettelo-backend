const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:fullstack@fullstackopen-1ysrx.mongodb.net/puhelinluettelo-backend?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({}).then(result => {
      console.log('phonebook:\n')
      result.forEach(person => {
          console.log(person.name, person.number)
      })
      mongoose.connection.close()
  })
} else {
  const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
  })
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
