const fs = require('fs')
const path = require('path')
const markdownIt = require('markdown-it')

const { postPath, buildPath } = require(`${process.env.PWD}/config.json`)
const layouts = require(`${process.env.PWD}/_layouts`)

const setInit = () => {
    // _build 파일도 없을 경우 처리 코드 작성 필요
    if (fs.existsSync(path.join(process.cwd(), ...buildPath))) {
        fs.rmSync(path.join(process.cwd(), ...buildPath), { recursive: true })
    }
    fs.mkdirSync(path.join(process.cwd(), ...buildPath))
}

const convertPostList = (posts, currentPath = []) => {
    const postList = []
    Object.keys(posts).map((v, i) => {
        if (typeof posts[v] === 'string') {
            postList.push({
                type: 'item',
                name: v,
                href: currentPath,
                key: `select-${Math.random().toString(36).substring(2, 16)}`
            })
        } else {
            postList.push({ type: 'open', name: v, key: -1 })
            postList.push(...convertPostList(posts[v], [...currentPath, v]))
            postList.push({ type: 'close', name: v, key: -1 })
        }
    })

    return postList
}

const convertNavi = (list) => {
    console.log(list)
    return list.map((post) => (layouts.navigator[post.type](post))).join('')
}

const convertPost = (currentPath, data) => {
    const mdData = fs.readFileSync(path.join(process.cwd(), ...postPath, ...currentPath, `${data.name}.md`), 'utf8')
    const htmlData = markdownIt().render(mdData)

    return htmlData
}

const createPage = (style, navigator, post) => {
    const postPage = layouts.post({
        style,
        navigator,
        post
    })

    return postPage
}

const makeFileStructure = (currentPath, page, data) => {
    fs.writeFileSync(path.join(process.cwd(), ...buildPath, ...currentPath, `${data.name}.html`), page)
    console.log(`##### make post >> ${path.join(...currentPath, data.name)} #####`)
}


module.exports = {
    setInit,
    convertPostList,
    convertPost,
    convertNavi,
    createPage,
    makeFileStructure
}