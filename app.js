const fs = require('fs')
const path = require('path')
const { marked } = require('marked')
const matter = require('gray-matter')
const dayjs = require('dayjs')
const { default: axios } = require('axios')

const post = require('./_layout/post')

const env = process.env.NODE_ENV

const utils = {
    path: {
        index: '/Users/ballboy/Documents/blog/index.md', // _post/index.md
        post: '/Users/ballboy/Documents/blog', // _post
        dist: '_dist',
        assets: '_assets',
        dev: `file://${__dirname}/_dist`,
        build: 'https://ballboyDev.github.io',
    },
    img: {},
    post: {},
    json: {},
    navi: [],
    contents: [],
}

const app = {
    run: async () => {
        console.log(`##### [ app.run < ${env} > ] #####`)

        await app.init()
        await app.mkJson();
        await app.mkNavi();
        await app.mkPostPage();
        await app.finalWork();
        await app.mkMainPage();
    },
    init: () => {
        console.log('\n##### [ app.init ] #####')

        if (fs.existsSync(utils.path.dist)) {
            fs.rmSync(utils.path.dist, { recursive: true })
        }
        fs.mkdirSync(`${utils.path.dist}`)
        fs.mkdirSync(`${utils.path.dist}/post`)
        fs.mkdirSync(`${utils.path.dist}/assets`)
        fs.mkdirSync(`${utils.path.dist}/assets/img`)

        fs.copyFileSync(`${utils.path.assets}/skin.css`, `${utils.path.dist}/assets/skin.css`)
        fs.copyFileSync(`${utils.path.assets}/markdown.css`, `${utils.path.dist}/assets/markdown.css`)
        fs.copyFileSync(`${utils.path.assets}/skin.js`, `${utils.path.dist}/assets/skin.js`)
        fs.cpSync(`${utils.path.assets}/img/`, `${utils.path.dist}/assets/img/`, { recursive: true })
        fs.cpSync(`${utils.path.post}/docsImg/`, `${utils.path.dist}/assets/img/`, { recursive: true })


        console.log('>> set Environment <<')
        console.group('set Path')
        console.log(`index: ${utils.path.index}`)
        console.log(`post: ${utils.path.post}`)
        console.log(`${env}: ${utils.path[env]}`)
        console.groupEnd()

        console.group('set Image')
        console.groupEnd()

    },
    mkJson: () => {
        console.log('\n##### [ app.mkJson ] #####')

        const recursion = (root, fold = []) => {
            const temp = {}

            // ballboy / index 파일과 공통 파일들의 관리 방안에 대하여 고민해보기
            const post = fs.readdirSync(root).filter((v) => { return ['_Common', 'index.md', 'docsImg'].indexOf(v) < 0 })

            post.map((v) => {
                const isDir = fs.statSync(`${root}/${v}`).isDirectory();

                if (isDir) {
                    const [title, index] = path.basename(v, path.extname(v)).split('_');

                    if (parseInt(index) !== 0) {
                        const child = recursion(`${root}/${v}`, [...fold, index]);
                        const count = Object.keys(child).reduce((a, b) => {
                            const [type, index] = b.split('_');
                            return a + (type === 'dir' ? child[b].count : (parseInt(index) === 0 ? 0 : 1));
                        }, 0);

                        const item = {
                            title,
                            file: '',
                            index: parseInt(index),
                            count,
                            children: { ...child }
                        };

                        temp[`dir_${index}`] = item;
                    }
                } else {
                    const mdFile = matter(fs.readFileSync(`${root}/${v}`, 'utf8').trim());
                    const title = mdFile.data?.title;
                    const index = mdFile.data?.index || 0;

                    if (v !== '.DS_Store') {
                        const item = {
                            title,
                            file: path.basename(v, path.extname(v)),
                            index: parseInt(index),
                            path: `${root}/${v}`,
                            fold,
                            date: mdFile.data?.date || '99999999',
                            ...mdFile.data,
                            content: mdFile.content.replace(/<.*?docsImg\/([^>]+)>/g, `<${utils.path[env]}/assets/img/$1>`)
                        };

                        temp[`post_${index}`] = item;
                        utils.contents.push(item);
                    }
                }


            })

            return temp
        }

        utils.post = { ...recursion(utils.path.post) }
        console.log(utils.post)
        fs.writeFileSync(`test.json`, JSON.stringify(utils.post))

    },
    mkNavi: () => {
        console.log('\n##### [ app.mkNavi ] #####')

        const tagList = []

        const recursion = (root) => {
            const item = Object.keys(root)

            item.sort((a, b) => {
                const [aType, aIndex] = a.split('_')
                const [bType, bIndex] = b.split('_')

                if (aType === bType) {
                    return parseInt(aIndex) - parseInt(bIndex)
                } else {
                    if (aType === 'post') {
                        return -1
                    } else {
                        return 1
                    }
                }
            }).map((v) => {
                const [type, num] = v.split('_')

                if (type === 'dir') {
                    tagList.push(`<li id="dt-${num}" onclick="foldNavi(${num})">${root[v].title} (${root[v].count})</li>`)
                    tagList.push(`<ul id="dc-${num}" style="display: none;">`)
                    tagList.push(recursion(root[v].children))
                    tagList.push('</ul>')
                } else {
                    if (parseInt(root[v].index) !== 0) {
                        // tagList.push(`<a href="${utils.path[env]}/post/${root[v].index}.html">`)
                        tagList.push(`<a href="${utils.path[env]}/post/${root[v].index}${env === 'dev' ? '.html' : ''}">`)
                        tagList.push(`<li id="p-${root[v].index}">${root[v]?.title || root[v]?.file}</li>`)
                        tagList.push(`</a>`)
                    }
                }
            })

            return tagList
        }

        recursion(utils.post)
        utils.navi = tagList
    },
    mkMainPage: () => {
        console.log('\n##### [ app.mkMainPage ] #####')

        const mdFile = matter(fs.readFileSync(`${utils.path.index}`, 'utf8').trim())
        const htmlFile = marked.parse(mdFile.content)

        const metaData = {
            env: env,
            url: utils.path[env],
            index: 0,
            fold: [],
            prev: 0,
            next: 0,
            navi: utils.navi,
            contents: htmlFile
        }

        const result = post.output(metaData)

        fs.writeFileSync(`${utils.path.dist}/index.html`, result)

    },
    mkPostPage: () => {
        console.log('\n##### [ app.mkPostPage ] #####')

        utils.contents.sort((a, b) => {
            return a.index - b.index
        }).filter((v) => {
            return parseInt(v.index) !== 0
        }).map((v) => {

            // ballboy / 포스팅 파일이 많아졌을때 성능/용량 이슈 발생 하지 않을지...?
            // const mdFile = matter(fs.readFileSync(v.path, 'utf8').trim())

            const htmlFile = marked.parse(v.content)

            const metaData = {
                env: env,
                url: utils.path[env],
                index: v.index,
                fold: v.fold,
                prev: v.prev || 0,
                next: v.next || 0,
                navi: utils.navi,
                contents: htmlFile
            }

            const result = post.output(metaData)

            fs.writeFileSync(`${utils.path.dist}/post/${v.index}.html`, result)
        })
    },
    finalWork: async () => {
        console.log('\n##### [ app.finalWork ] #####')

        const posting = [`# Posting List (${dayjs().format("YYYY.MM.DD")})\n`, '||title|date|prev|next|url|', '|:-:|:--|:-:|:-:|:-:|:--|']
        const index = [
            '# 심심한 개발자의 심심한 블로그',
            '[![Static Badge](https://img.shields.io/badge/yswgood0329%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=EA4335&label=gmail&labelColor=FFFFFF)](https://mail.google.com/) [![Static Badge](https://img.shields.io/badge/%40ballboy.329-FFFFFF?style=for-the-badge&logo=instagram&logoColor=FFFFFF&label=INSTA&labelColor=E4405F)](https://www.instagram.com/ballboy.329)',
            '- 심심한 개발자가 심심해서 만들었고 심심할때 끄적여 보는 심심한 개발자의 심심한 블로그 입니다.',
            '- 꾸준한 기능 개발과 개발과 일상 생활과 관련된 다양한 글을 작성하기 위해 노력하고 있습니다.',
            '',
            `## Posting List (${dayjs().format("YYYY.MM.DD")})`,
            '||title|date|',
            '|:-:|:--|:-:|'
        ]

        for (let i = 0; i < utils.contents.length; i++) {
            const item = utils.contents[i]
            let status = false
            try {
                let temp = await axios.get(`${utils.path.build}/post/${item.index}.html`)
                status = temp.status === 200
            } catch (err) {
                // console.log(err)
                if (err.status !== 404) {
                    console.log(`ERROR >> ${item?.title || item?.file || 'no file'}`)
                }
            }

            // create posting.md
            const text1 = `|[ ${item.index} ]|${item?.title || item?.file}|${item.date}|${item?.prev || ''}|${item?.next || ''}|${status ? `${utils.path.build}/post/${item.index}${env === 'dev' ? '.html' : ''}` : 'not yet'}|`
            posting.push(text1)

            // ballboy / create index.md / 포스팅 리스트 레이아웃을 따로 제작하는 방향으로 개선
            if (item?.index && parseInt(item.index) !== 0) {
                const text2 = `|[ ${item.index} ]|[${item?.title || item?.file}](${utils.path[env]}/post/${item.index}${env === 'dev' ? '.html' : ''})|${item.date}|`
                index.push(text2)
            }

            console.log(`[ ${item.index} ] ${item?.title || item?.file}`)
        }

        fs.writeFileSync(`readme.md`, posting.join('\n'))
        fs.writeFileSync(utils.path.index, index.join('\n'))
    }
}

app.run()