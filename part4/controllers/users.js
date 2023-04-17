const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})
  
usersRouter.post('/', async (request, response, next) => {

    const { username, name, password } = request.body

    if (password === undefined) {
        return response.status(400).json({ error: 'password missing' })
    }
    if (password.length < 3) {
        return response.status(400).json({ error: 'password too short' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
      
    const user = new User({
        username,
        name,
        passwordHash,
    })
    
    try {
        const result = await user.save()
        response.status(201).json(result)
    }
    catch(exception) {
        next(exception)}
})

usersRouter.delete('/:id', async (request, response, next) => {
    try {
        await User.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } 
    catch(exception) {
        next(exception)
    }
})
      
module.exports = usersRouter

