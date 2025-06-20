const { marked } = require('marked')
const hljs = require('highlight.js')
const env = process.env.NODE_ENV
const path = require('path')

const custom = {
    path: {},
    // 헤드 텍스트 북마크 기능을 위한 태그id 값 생성 (#(h1) ~ ###(h3))
    heading: (meta) => {
        return `<h${meta.depth} id="bm-${meta.index}">${meta.text}</h${meta.depth}>`
    },
    // 포스팅 첨부 이미지 빌드 시 동적 path 적용
    image: (meta) => {
        return `<img src="${meta.href.search(/(?:\.\.\/)*docsImg\//g) > -1 ? `${custom.path[env]}/assets/img/${path.basename(meta.href)}` : meta.href}" alt="${meta.text}">`
    },
    // 코드 하이라이트 적용
    code: (meta) => {
        if (!!hljs.getLanguage(meta.lang)) {
            const result = hljs.highlight(meta.text, { language: meta.lang })
            return `<pre class="theme-atom-one-dark"><code class="language-${meta.lang}">${result.value}</code></pre>`
        }

        return `<pre><code class="language-plaintext"}>${meta.text}</code></pre>`

    },
    // 코드블럭 배경색 커스텀 기능
    codespan: (meta) => {
        const colorSet = {
            primary: '#0d6efd',
            warning: '#ffc107',
            error: '#dc3545'
        }

        const color = meta.text.match(/!\[([^\[\]]+)\]$/)

        if (!!color) {
            return `<code style="background-color: ${!!colorSet[color[1]] ? colorSet[color[1]] : color[1]};">${meta.text}</code>`
        }

        return `<code>${meta.text}</code>`
    }
}

const markdown = (p) => {
    console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ custom.markdown ] #####')

    try {
        custom.path = p

        const renderer = new marked.Renderer()

        renderer.heading = custom.heading
        renderer.image = custom.image
        renderer.code = custom.code
        renderer.codespan = custom.codespan
        // renderer.table = (meta) => {
        //     console.log(JSON.stringify(meta))
        // }
        // renderer.tablerow = (meta) => {
        //     console.log('tablerow >>', meta)
        // }
        // renderer.tablecell = (meta) => {
        //     console.log('tablecell >>', meta)
        //     return '<td align="center">6</td>\n'
        // }


        // renderer.text = (meta) => { console.log(meta) }


        // marked.use({
        //     extensions: [{
        //         name: 'heading',
        //         renderer(token) {
        //             return `<h${token.depth}>${token.text}</h${token.depth}>`
        //         }
        //     }]
        // })

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

