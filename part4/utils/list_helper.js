const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((likes, item) => likes + item.likes, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current) 
    return `{\ntitle: ${maxLikes.title}\nauthor: ${maxLikes.author}\nlikes: ${maxLikes.likes}\n}` 
}

const mostBlogs = (blogs) => {
    const groupedByAuthors = _.groupBy(blogs, 'author')
    const sorted = Object.entries(groupedByAuthors).sort((a, b) => b[1].length - a[1].length)
    return `{\nauthor: ${sorted[0][0]}\nblogs: ${sorted[0][1].length}\n}` 
}

const mostLikes = (blogs) => {
    const groupedByAuthors = Object.entries(_.groupBy(blogs, 'author'))
    const likes = groupedByAuthors.map(item => item[1].reduce((likes, item) => likes + item.likes, 0))
    const maxLikes = likes.indexOf(Math.max(...likes))
    return `{\nauthor: ${groupedByAuthors[maxLikes][0]}\nlikes: ${likes[maxLikes]}\n}` 
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
