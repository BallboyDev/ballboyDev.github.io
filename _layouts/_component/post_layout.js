const fs = require('fs')
const path = require('path')
const axios = require('axios')
const markdownIt = require('markdown-it')

const post = {
    init: (post) => {
        try {
            const markdown = fs.readFileSync(post.link, 'utf8')
            // const { data } = await axios.get(post.link)

            const html = markdownIt().render(markdown)
            return html
        } catch (ex) {
            console.log(ex)
        }
    },
    init3: (post) => {
        new Promise((resolve, error) => {
            if (!(post.link.includes('https://') || post.link.includes('http://'))) {
                const data = fs.readFileSync(post.link, 'utf8')
                const html1 = markdownIt().render(data)
                resolve(html1)
            } else {
                axios.get(post.link).then((res) => {
                    const { data } = res
                    const html2 = markdownIt().render(data)
                    resolve(html2)
                })
            }
        }).then((res) => {
            console.log('ballboy res >>> ', res)
            return res
        })
    },
    init2: async (post) => {
        if (!(post.link.includes('https://') || post.link.includes('http://'))) {
            const data = fs.readFileSync(post.link, 'utf8')
            const html1 = markdownIt().render(data)
            return html1
        } else {
            const { data } = await axios.get(post.link)
            const html2 = markdownIt().render(data)
            return html2
        }
    }
}

module.exports = post