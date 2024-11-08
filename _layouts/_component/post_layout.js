const fs = require('fs')
const path = require('path')
const markdownIt = require('markdown-it')

const config = require(`${process.env.PWD}/config2.json`)


const post = {

    init: (post) => {
        try {
            const markdown = fs.readFileSync(path.join(config.postPath, ...post.href), 'utf8')
            const html = markdownIt().render(markdown)

            return html
        } catch (ex) {
            console.log(ex)
        }
    }
}

module.exports = post