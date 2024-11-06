const fs = require('fs')
const path = require('path')
const utils = require('./_utils')

const { buildPath } = require('./config.json')

// init
if (fs.existsSync(path.join(__dirname, ...buildPath))) {
    fs.rmSync(path.join(__dirname, ...buildPath), { recursive: true })
}
fs.mkdirSync(path.join(__dirname, ...buildPath))

// make json file

// read json file
const json = require('./_markdown/index.json')
const { posts, main } = json

const postList = utils.searchItems(posts)

// make navigator
const navi = utils.convertNavi(postList)

const currentPath = []
// make html page

try {
    postList.map((v, i, a) => {

        if (v.type === 'open') {
            if (!fs.existsSync(path.join(__dirname, ...buildPath, ...currentPath, v.name))) {
                console.log(`##### make folder >> ${path.join(...currentPath, v.name)} #####`)
                fs.mkdirSync(path.join(__dirname, ...buildPath, ...currentPath, v.name))
            }
            currentPath.push(v.name)

        } else if (v.type === 'close') {
            currentPath.pop()

        } else {
            // make post page
            const post = utils.convertPost(currentPath, v)

            // make selected css
            const selectedCss = '' //`.${v.key} {color: red}`

            // create page
            const page = utils.createPage(selectedCss, navi, post)

            // make html file
            utils.makeFileStructure(currentPath, page, v)

        }

    })

} catch (ex) {
    console.error(ex)
}