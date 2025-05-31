const { marked } = require('marked')
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
    },
    code: (meta) => {
        if (!!hljs.getLanguage(meta.lang)) {
            const result = hljs.highlight(meta.text, { language: meta.lang })
            return `<pre class="theme-atom-one-dark"><code class="language-${meta.lang}">${result.value}</code></pre>`
        }

        return `<pre><code class="language-plaintext"}>${meta.text}</code></pre>`

    },
}

const markdown = (p) => {
    console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ custom.markdown ] #####')

    try {
        custom.path = p

        const renderer = new marked.Renderer()

        renderer.heading = custom.heading
        renderer.image = custom.image
        renderer.code = custom.code

        marked.setOptions({
            renderer: renderer,
        })

    } catch (err) {
        console.error(err)
    } finally {
        console.groupEnd()
        console.log('Done!!!')
    }

}

module.exports = {
    markdown
}

