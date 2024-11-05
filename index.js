

// make json file

// read json file
const json = require('./_markdown/index.json')
const { posts, main } = json

Object.keys(posts).map((v) => {
    console.log(typeof posts[v])
})