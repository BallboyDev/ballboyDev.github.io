const fs = require('fs')
const path = require('path')
const config = require(`${process.env.PWD}/config.json`)

module.exports = core = {
    initBuild: () => {
        if (fs.existsSync(config.buildPath)) {
            fs.rmSync(config.buildPath, { recursive: true })
        }
        fs.mkdirSync(config.buildPath)
    },

    createPostData: ({ posts } = require(path.join(config.postPath, './index.json')), currentPath = []) => {
        console.log('ballboy >> createPostData()')
        const postList = []

        Object.keys(posts).map((post, i) => {
            if (typeof posts[post] === 'string') {
                postList.push({
                    type: 'item',
                    name: post,
                    href: currentPath,
                    link: !(posts[post].includes('https://') || posts[post].includes('http://')) ? path.join(config.baseUrl, posts[post]) : posts[post],
                    key: `post-${Math.random().toString(36).substring(2, 16)}`
                })
            } else {
                postList.push({ type: 'open', name: post, key: `folder-${Math.random().toString(36).substring(2, 16)}` })
                postList.push(...core.createPostData({ posts: posts[post] }, [...currentPath, post]))
                postList.push({ type: 'close', name: post, key: `folder-${Math.random().toString(36).substring(2, 16)}` })
            }
        })

        return postList
    },

    createInfoData: () => {

        const { infos } = require(path.join(config.postPath, './index.json'))

        const infoList = Object.keys(infos).map((info) => {
            return {
                type: 'info',
                name: info,
                link: !(infos[info].includes('https://') || infos[info].includes('http://')) ? path.join(config.baseUrl, infos[info]) : infos[info],
                href: [],
                key: `${info}-page`
            }
        })

        return infoList
    },

    createPageParamList: ({ postList, infoList }) => {
        console.log('ballboy >> createComponent()')
        const layouts = require(config.layoutsPath)

        const pageParamList = []

        // navigator 코드 생성
        const navigator_html = layouts.navigator.init(postList)

        // post page 생성
        postList.map((post) => {
            if (post.type === 'item') {
                // post page 코드 생성
                const post_html = layouts.post.init(post)

                // page style 코드 생성
                const style_css = layouts.style.init(post)

                pageParamList.push({
                    ...post,
                    style: style_css,
                    navigator: navigator_html,
                    post: post_html,
                })
            }
        })

        // info page 생성
        infoList.map((info) => {
            pageParamList.push({
                ...info,
                style: `.${info.name}-page {color: pink}`,
                navigator: navigator_html,
                post: layouts.post.init(info)
            })
        })

        return pageParamList
    },

    createPage: (pageParamList) => {
        console.log('ballboy >> createPage()')
        const layouts = require(config.layoutsPath)

        pageParamList.map((pageParam) => {
            const html = layouts.postPage.init(pageParam)

            core.createFile(pageParam, html)
        })
    },

    createFile: (pageParam, html) => {
        const buildPathType = [config.buildPath, pageParam.type === 'item' ? 'post' : '.']
        if (!fs.existsSync(path.join(...buildPathType, ...pageParam.href))) {
            fs.mkdirSync(path.join(...buildPathType, ...pageParam.href))
        }

        fs.writeFileSync(path.join(...buildPathType, ...pageParam.href, `${pageParam.name}.html`), html)
    },

    createOthers: () => {
        console.log('ballboy >> createOthers()')

        if (!fs.existsSync(path.join(config.buildPath, 'static'))) {
            fs.mkdirSync(path.join(config.buildPath, 'static/css'), { recursive: true })
            fs.mkdirSync(path.join(config.buildPath, 'static/js'), { recursive: true })
            fs.mkdirSync(path.join(config.buildPath, 'static/img'), { recursive: true })
        }

        // css 파일
        fs.copyFileSync(`${config.assetsPath}/css/styles.css`, `${config.buildPath}/static/css/styles.css`, fs.constants.COPYFILE_FICLONE)

        // js 파일

        // image 파일

    },
}