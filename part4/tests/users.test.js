const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('user is not added to the database if username is missing', async () => {
    const user = {
        name:'John Doe',
        password: 'pass',
    }
    const origUsers = await api.get('/api/users')
    await api
        .post('/api/users').send(user)
        .expect(500)
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(origUsers.body.length)
})

test('user is not added to the database if username is too short', async () => {
    const user = {
        username: 'he',
        name:'John Doe',
        password: 'pass',
    }
    const origUsers = await api.get('/api/users')
    await api
        .post('/api/users').send(user)
        .expect(500)
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(origUsers.body.length)
})

test('user is not added to the database if password is missing', async () => {
    const user = {
        username: 'john',
        name:'John Doe',
    }
    const origUsers = await api.get('/api/users')
    await api
        .post('/api/users').send(user)
        .expect(400)
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(origUsers.body.length)
})

test('user is not added to the database if password is too short', async () => {
    const user = {
        username: 'john',
        name:'John Doe',
        passwordHash: 'ss',
    }
    const origUsers = await api.get('/api/users')
    await api
        .post('/api/users').send(user)
        .expect(400)
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(origUsers.body.length)
})

test('user is not added to the database if username is not unique', async () => {
    const origUsers = await api.get('/api/users')
    const userToCopy = origUsers.body[0]
    console.log(userToCopy.username)
    const user = {
        username: userToCopy.username,
        name: 'Jane Doe',
        password: 'pass',
    }
    await api
        .post('/api/users').send(user)
        .expect(500)
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(origUsers.body.length)
})

test('user is added to the database when values are correct', async () => {
    const origUsers = await api.get('/api/users')
    const user = {
        username: 'testuser',
        name: 'testuser',
        password: 'testuser',
    }
    await api
        .post('/api/users').send(user)
        .expect(201)
            
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(origUsers.body.length + 1)
})

afterAll(async () => {
    await mongoose.connection.close()
})