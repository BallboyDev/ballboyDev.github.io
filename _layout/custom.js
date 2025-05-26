const { marked } = require('marked')
const { markedHighlight } = require('marked-highlight')
const hljs = require('highlight.js')
const env = process.env.NODE_ENV
const path = require('path')

const custom = {
    path: {},
    heading: (meta) => {
        return `<h${meta.depth} id="bm-${meta.index}">${meta.text}</h${meta.depth}>`
    },
    image: (meta) => {
        return `<img src="${meta.href.search(/(?:\.\.\/)*docsImg\//g) > -1 ? `${custom.path[env]}/assets/img/${path.basename(meta.href)}` : meta.href}" alt="${meta.text}">`
    }
}

const markdown = (p) => {
    custom.path = p

    const renderer = new marked.Renderer()

    renderer.heading = custom.heading
    renderer.image = custom.image

    marked.setOptions({
        renderer: renderer,
        highlight: (code, lang) => {
            console.log(code, lang)
            const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language: validLang }).value;
        },
        langPrefix: 'hljs language-'
    })



}

module.exports = {
    markdown
}

