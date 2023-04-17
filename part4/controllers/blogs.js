const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//const getTokenFrom = request => {
//    const authorization = request.get('authorization')
//    if (authorization && authorization.startsWith('Bearer ')) {
//        return authorization.replace('Bearer ', '')
//    }
//    return null
//}


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    //const decodedToken = jwt.verify(request.token, process.env.SECRET)

    //if (!decodedToken.id) {
    //    return response.status(401).json({ error: 'token invalid' })
    //}
    //const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        user: request.user.id,
        url: body.url,
        likes: body.likes
    })
    if (!blog.likes) 
        blog.likes = 0 
    if (!blog.url || !blog.title) 
        return response.status(400).json({ error: 'Bad request' })
    else {
        const result = await blog.save()

        

        request.user.blogs = request.user.blogs.concat(result._id)
        await request.user.save()
        response.status(201).json(result)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    //if (!request.token) {
    //    return response.status(401).json({ error: 'token missing' })
    //}
    //const decodedToken = jwt.verify(request.token, process.env.SECRET)
    //if (!decodedToken.id) {
    //    return response.status(401).json({ error: 'token invalid' })
    //}
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog.user.toString() !== request.user.id.toString()) {
            return response.status(401).json({ error: 'user not authorized to delete blog' })
        }
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } 
    catch(exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const entry = { 
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes   
    }
    try {
        const updatedEntry = await Blog.findByIdAndUpdate(request.params.id, entry, { new: true })
        response.json(updatedEntry)
    }
    catch(exception) {
        next(exception)
    }
})

module.exports = blogsRouter




