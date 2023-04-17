const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

//token for user test, password test: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY0Mzk2MWQ0MzY1OGJmYTU0YzBkZDgxMiIsImlhdCI6MTY4MTU2NzU2MX0.x88LAFEMZwqsNFY19w0DkHVGjHtohCDjKdlz7Iw5ZeE

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

//test('there are two blogs', async () => {
//    const response = await api.get('/api/blogs')
//  
//    expect(response.body).toHaveLength(2)
//})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
  
    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('a new blog is correctly added to the database', async () => {
    const blog = {
        title:'testblog',
        author: '',
        url: 'testblogurl',
        likes: 5
    }

    const origResp = await api.get('/api/blogs').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY0Mzk2MWQ0MzY1OGJmYTU0YzBkZDgxMiIsImlhdCI6MTY4MTU2NzU2MX0.x88LAFEMZwqsNFY19w0DkHVGjHtohCDjKdlz7Iw5ZeE')
    console.log(origResp.body)
    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY0Mzk2MWQ0MzY1OGJmYTU0YzBkZDgxMiIsImlhdCI6MTY4MTU2NzU2MX0.x88LAFEMZwqsNFY19w0DkHVGjHtohCDjKdlz7Iw5ZeE')
        .send(blog)
        .expect(201)
    const response = await api.get('/api/blogs').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY0Mzk2MWQ0MzY1OGJmYTU0YzBkZDgxMiIsImlhdCI6MTY4MTU2NzU2MX0.x88LAFEMZwqsNFY19w0DkHVGjHtohCDjKdlz7Iw5ZeE')
    console.log(response.body)
    expect(response.body).toHaveLength(origResp.body.length + 1)
    response.body.forEach(blog => {
        expect(blog.title).toBeDefined()
    })
    response.body.forEach(blog => {
        expect(blog.url).toBeDefined()
    })      
})

test('if new blog to be added misses \'likes\' it defaults to zero', async () => {
    const blog = {
        title:'NEW BLOG',
        author: '',
        url: 'url/blog',
    }
    const response = await api.post('/api/blogs').send(blog)
    expect(response.body.likes).toBe(0)
})

test('if new blog to be added misses \'title\' response is 400 Bad Request', async () => {
    const blog = {
        author: '',
        url: 'url/blog',
        likes: 4
    }
    await api
        .post('/api/blogs').send(blog)
        .expect(400)
})

test('if new blog to be added misses \'url\' response is 400 Bad Request', async () => {
    const blog = {
        title: 'BLOG TITLE',
        author: '',
        likes: 4
    }
    await api
        .post('/api/blogs').send(blog)
        .expect(400)
})

test('a blog can be deleted', async () => {
    const origResp = await api.get('/api/blogs')
    const blogToDelete = origResp.body[0]
      
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
  
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(origResp.body.length -1)
})

test('a blog can be updated', async () => {
    const origResp = await api.get('/api/blogs')
    const blogToUpdate = origResp.body[0]
    const blog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 10000
    }
      
    await api
        .put(`/api/blogs/${blogToUpdate.id}`).send(blog)
        .expect(200)
  
    const response = await api.get('/api/blogs')
    expect(response.body[0].likes).toBe(10000)
})

afterAll(async () => {
    await mongoose.connection.close()
})