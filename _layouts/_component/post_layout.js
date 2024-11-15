const fs = require('fs')
const path = require('path')
const axios = require('axios')
const markdownIt = require('markdown-it')

const post = {
    init: (post) => {
        try {
            const markdown = fs.readFileSync(post.link, 'utf8')

            const html = markdownIt().render(markdown)
            return html
        } catch (ex) {
            console.log(ex)
        }
    }
}

module.exports = post