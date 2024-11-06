const fs = require('fs')
const path = require('path')
const markdownIt = require('markdown-it')

const { postPath, buildPath, layoutInfo } = require('../config.json')

const test = () => { console.log('test') }

const searchItems = (items) => {
    const html = []
    Object.keys(items).map((v, i) => {
        if (typeof items[v] === 'string') {
            // html.push(`i|${v}`)
            html.push({ type: 'item', name: v, key: `select-${Math.random().toString(36).substring(2, 16)}` })
        } else {
            html.push({ type: 'open', name: v, key: -1 })
            const temp = searchItems(items[v])
            html.push(...temp)
            html.push({ type: 'close', name: v, key: -1 })
        }
    })

    return html
}

const convertNavi = (list) => {
    const result = []

    list.map((v) => {
        if (v.type === 'item') {
            result.push(`<a class="link" href=""><div class="item click ${v.key}">${v.name}</div></a>`)
        } else if (v.type === 'open') {
            result.push(`<div class="folder"><div class="title click">${v.name}</div>`)
        } else if (v.type === 'close') {
            result.push('</div>')
        }
    })

    return result.join('')
}

const convertPost = (currentPath, data) => {
    const mdData = fs.readFileSync(path.join(process.cwd(), ...postPath, ...currentPath, `${data.name}.md`), 'utf8')
    const htmlData = markdownIt().render(mdData)

    return htmlData
}

const createPage = (style, navi, post) => {
    const { layoutPath, layoutVariable } = layoutInfo
    let postlayout = fs.readFileSync(path.join(process.cwd(), ...layoutPath, 'post.html'), 'utf8')

    // css
    postlayout = postlayout.replace(layoutVariable.css, `<style>${style}</style>`)

    // navigator
    postlayout = postlayout.replace(layoutVariable.navigator, navi)

    // post
    postlayout = postlayout.replace(layoutVariable.post, post)

    return postlayout
}

const makeFileStructure = (currentPath, page, data) => {
    fs.writeFileSync(path.join(process.cwd(), ...buildPath, ...currentPath, `${data.name}.html`), page)
    console.log(`##### make post >> ${path.join(...currentPath, data.name)} #####`)
}

module.exports = {
    test,
    searchItems,
    convertPost,
    convertNavi,
    createPage,
    makeFileStructure
}