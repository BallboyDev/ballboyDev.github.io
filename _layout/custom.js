const { marked, parseInline } = require('marked')
const hljs = require('highlight.js')
const env = process.env.NODE_ENV
const path = require('path')

const renderer = new marked.Renderer()

const custom = {
    path: {},
    // 헤드 텍스트 북마크 기능을 위한 태그id 값 생성 (#(h1) ~ ###(h3))
    heading: (meta) => {
        return `<h${meta.depth} id="bm-${meta.index}">${meta.text}</h${meta.depth}>\n`
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

        return `<pre><code class="language-plaintext"}>${meta.text}</code></pre>\n`

    },
    // 코드블럭 배경색 커스텀 기능
    codespan: (meta) => {
        const colorSet = {
            primary: '#0d6efd',
            warning: '#ffc107',
            error: '#dc3545'
        }
        const text = meta.text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')

        const color = text.match(/!\[([^\[\]]+)\]$/)

        if (!!color) {
            return `<code style="background-color: ${!!colorSet[color[1]] ? colorSet[color[1]] : color[1]};">${text.substring(0, color.index).trim()}</code>`
        }

        return `<code style="color: rgb(255 188 54)">${text}</code>`
    },
    // 테이블 태그 헤드 존재에 따른 디자인 수정
    table: (meta) => {
        const { header, rows } = meta

        // header
        let existsHead = false
        const headRow = header.reduce((a, c) => {
            existsHead = existsHead || !!c.text
            return `${a}${custom.tablecell(c)}`
        }, '')

        const headTag = custom.tablerow(headRow)

        //body
        const bodyTag = rows.map((row) => {
            const bodyRow = row.reduce((a, c) => {
                return `${a}${custom.tablecell(c)}`
            }, '')

            return custom.tablerow(bodyRow)

        }).join('\n')


        const result = `
        <table>
            ${!!existsHead ? `<thead>${headTag}</thead>` : ''}
            <tbody>${bodyTag}</tbody>
        </table>
        `

        return result
    },
    tablerow: (text) => {
        return `<tr>${text}</tr>`
    },
    tablecell: (meta) => {
        const content = marked.parseInline(meta.text)
        const type = meta.header ? 'th' : 'td'
        const tag = meta.align
            ? `<${type} align="${meta.align}">`
            : `<${type}>`;

        return tag + content + `</${type}>\n`;
    }

}

const markdown = (p) => {
    console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ custom.markdown ] #####')

    try {
        custom.path = p

        renderer.heading = custom.heading
        renderer.image = custom.image
        renderer.code = custom.code
        renderer.codespan = custom.codespan
        renderer.table = custom.table

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

