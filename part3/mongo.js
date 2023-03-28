const mongoose = require('mongoose')

if (process.argv.length<3 || process.argv.length!==5) {
  console.log('give the correct arguments')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://dbuser:${password}@cluster0.2ucfl6t.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length==3) {
  Phonebook.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length==5) {
  const entry = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
  })
  entry.save().then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}