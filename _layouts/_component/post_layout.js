const fs = require('fs')
const path = require('path')
const markdownIt = require('markdown-it')

const config = require(`${process.env.PWD}/config.json`)

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