const fs = require('fs')
const path = require('path')
const { marked } = require('marked')
const matter = require('gray-matter')
const dayjs = require('dayjs')
const { default: axios } = require('axios')

const post = require('./_layout/post')
const custom = require('./_layout/custom')

const env = process.env.NODE_ENV

const utils = require('./config')

const app = {
    run: async () => {
        console.log('\x1b[43m\x1b[30m%s\x1b[0m', `##### [ app.run < ${env} > ] #####`)

        await app.init()
        await custom.markdown(utils.path)
        await app.mkJson();
        await app.mkNavi();
        await app.mkMainPage();
        await app.mkPostPage();
        await app.finalWork();
    },
    init: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.init ] #####')

        try {
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
            if (env === 'dev') {
                fs.copyFileSync(`${utils.path.assets}/env.js`, `${utils.path.dist}/assets/env.js`)
            }
            fs.cpSync(`${utils.path.assets}/img/`, `${utils.path.dist}/assets/img/`, { recursive: true })
            fs.cpSync(`${utils.path[!!process.env.TEST ? 'mdTest' : 'post']}/docsImg/`, `${utils.path.dist}/assets/img/`, { recursive: true })


            console.log('>> set Environment <<')
            console.group('set Path')
            console.log(`index: ${utils.path.index}`)
            console.log(`post: ${utils.path[!!process.env.TEST ? 'mdTest' : 'post']}`)
            console.log(`${env}: ${utils.path[env]}`)
            console.groupEnd()

            console.group('set Image')
            console.groupEnd()
        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }


    },
    mkJson: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.mkJson ] #####')

        try {
            const recursion = (root, fold = []) => {
                const temp1 = {}
                const temp2 = {}

                // ballboy / index 파일과 공통 파일들의 관리 방안에 대하여 고민해보기
                const post = fs.readdirSync(root).filter((v) => { return utils.commonFile.indexOf(v) < 0 })

                post.sort((a, b) => {
                    const aType = path.extname(a)
                    const bType = path.extname(b)

                    if (aType === bType) {
                        return a.length - b.length
                    } else {
                        if (aType === '') {
                            return 1
                        } else {
                            return -1
                        }
                    }
                }).map((v) => {
                    const isDir = fs.statSync(`${root}/${v}`).isDirectory();

                    if (isDir) {
                        const [title, tempIdx] = path.basename(v, path.extname(v)).split('_');

                        // 개발 환경에서 디렉토리의 index 값이 0인 경우에도 Navi 표현
                        const index = parseInt(tempIdx) === 0 ? `T${Math.floor(Math.random() * 9999)}` : tempIdx

                        if (env === 'dev' || (env === 'build' && parseInt(tempIdx) !== 0)) {
                            const [child, json] = recursion(`${root}/${v}`, [...fold, index]);
                            const count = Object.keys(child).reduce((a, b) => {
                                const [type, index] = b.split('_');
                                return a + (
                                    type === 'dir' ?
                                        child[b].count :
                                        (
                                            parseInt(child[b].index) !== 0 && (env === 'dev' || (env === 'build' && child[b].upload)) ? 1 : 0
                                        )
                                );
                            }, 0);

                            const item = {
                                title,
                                file: '',
                                index: parseInt(index),
                                count,
                                children: { ...child }
                            };

                            temp1[`dir_${index}`] = item;
                            temp2[title] = { ...json }
                        }
                    } else {
                        const mdFile = matter(fs.readFileSync(`${root}/${v}`, 'utf8').trim());
                        const { birthtime, mtime } = fs.statSync(`${root}/${v}`)
                        const title = mdFile.data?.title;
                        const index = mdFile.data?.index || 0;
                        const upload = mdFile.data?.upload || false;

                        if (v !== '.DS_Store') {

                            // const token = marked.lexer(mdFile.content.replace(/<.*?docsImg\/([^>]+)>/g, `<${utils.path[env]}/assets/img/$1>`)).map((v, i) => { return { index: i, ...v } })
                            const token = marked.lexer(mdFile.content).map((v, i) => { return { index: i, ...v } })

                            const item = {
                                title,
                                file: path.basename(v, path.extname(v)),
                                index: parseInt(index),
                                path: `${root}/${v}`,
                                fold,
                                date: !!mdFile.data?.date ? dayjs(`${mdFile.data?.date}`, 'YYYYMMDD').format("YYYY-MM-DD HH:mm:ss") : dayjs(birthtime),
                                birthtime, mtime,
                                token: token,
                                bookmark: token.filter((v) => { return v.type === 'heading' && v.depth <= 3 }),
                                ...mdFile.data,
                            };

                            temp1[`post_${index}`] = item;
                            if (upload) {
                                temp2[`${title || path.basename(v, path.extname(v))}`] = `${utils.path.build}/post/${parseInt(index)}`
                            }
                            utils.contents.push(item);
                        }
                    }


                })

                return [temp1, temp2]
            }

            [utils.post, utils.json] = [...recursion(utils.path[!!process.env.TEST ? 'mdTest' : 'post'])]

            console.log('ballboy >> utils.json, utils.post, utils.content')

            if (env === 'dev' || env === 'test') {
                fs.writeFileSync(`test.json`, JSON.stringify(utils.contents))
            }

            fs.writeFileSync(`${utils.path.dist}/post.json`, JSON.stringify(utils.json))
        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }

    },
    mkNavi: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.mkNavi ] #####')

        try {
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
                        tagList.push(`<li id="dt-${num}" ${num.indexOf('T') >= 0 ? "class='dt-temp'" : ''} onclick="foldNavi('${num}')">${root[v].title} (${root[v].count})</li>`)
                        tagList.push(`<ul id="dc-${num}" class='dc-all' style="display: ${parseInt(num) === 1 ? 'block' : 'none'};">`)
                        tagList.push(recursion(root[v].children))
                        tagList.push('</ul>')
                    } else {
                        if (parseInt(root[v].index) !== 0 && (env === 'dev' || (env === 'build' && root[v].upload))) {
                            // tagList.push(`<a href="${utils.path[env]}/post/${root[v].index}.html">`)
                            tagList.push(`<a href="${utils.path[env]}/post/${root[v].index}${env === 'dev' ? '.html' : ''}">`)
                            tagList.push(`<li id="p-${root[v].index}">• ${root[v]?.title || root[v]?.file}</li>`)
                            tagList.push(`</a>`)
                        }
                    }
                })

                return tagList
            }

            recursion(utils.post)
            utils.navi = tagList
        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }
    },
    mkMainPage: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.mkMainPage ] #####')

        try {
            const mdFile = matter(fs.readFileSync(`${utils.path.index}`, 'utf8').trim())
            // const content = `${mdFile.content}\n\n\n${utils.postingList.join('\n')}`
            const content = `${mdFile.content}`

            const htmlFile = marked.parse(content)

            const metaData = {
                env: env,
                url: utils.path[env],
                fold: [],
                navi: utils.navi,
                contents: htmlFile
            }

            const result = post.output(metaData)

            fs.writeFileSync(`${utils.path.dist}/index.html`, result)
        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }

    },
    mkPostPage: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.mkPostPage ] #####')

        try {
            utils.contents.sort((a, b) => {
                return a.index - b.index
            }).filter((v) => {
                return parseInt(v.index) !== 0 && (env === 'dev' || (env === 'build' && v.upload))
            }).map((v) => {

                // console.log(v.bookmark)

                // ballboy / 포스팅 파일이 많아졌을때 성능/용량 이슈 발생 하지 않을지...?
                // const mdFile = matter(fs.readFileSync(v.path, 'utf8').trim())

                const htmlFile = marked.parser(v.token)

                const metaData = {
                    title: v?.title || v.file,
                    env: env,
                    url: utils.path[env],
                    index: v.index,
                    fold: v.fold,
                    navi: utils.navi,
                    contents: htmlFile,
                    bookmark: v.bookmark,
                    comment: v.comment,
                    link: v.link
                }

                const result = post.output(metaData)

                fs.writeFileSync(`${utils.path.dist}/post/${v.index}.html`, result)
            })
        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }
    },
    finalWork: async () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.finalWork ] #####')

        console.log('\x1b[36m[ 배포* ]  \x1b[36m[ 배포대기 ]  \x1b[33m[ 작성중 ]  \x1b[31m[ 기획중 ]\x1b[0m\n')

        try {
            const posting = [`# Posting List (${dayjs().format("YYYY.MM.DD")})\n`, '||index|title|date|prev|next|url|', '|:-:|:-:|:--|:-:|:-:|:-:|:--|']
            const sitemap = []
            const recentPost = []
            let index = 1;

            for (let i = 0; i < utils.contents.length; i++) {
                const item = utils.contents[i]
                let status = false
                try {
                    let temp = await axios.get(`${utils.path.build}/post/${item.index}.html`)
                    status = temp.status === 200
                } catch (err) {
                    // console.log(err)
                    if (err.status !== 404) {
                        console.log(`ERROR [${err.status}] >> ${item?.title || item?.file || 'no file'}`)
                    }
                }

                // create posting.md
                const [prev, next] = !!item?.link ? item.link.split('/') : [0, 0]

                const text1 = `|${parseInt(item.index) === 0 ? '0' : index}|[ ${item.index} ]|${item?.title || item?.file}|${item.date}|${parseInt(prev) !== 0 ? prev : ''}|${parseInt(next) !== 0 ? next : ''}|${status ? `${utils.path.build}/post/${item.index}${env === 'dev' ? '.html' : ''}` : 'not yet'}|`
                posting.push(text1)

                const text2 = item.index !== 0 && !!status ? `<url><loc>${utils.path.build}/post/${item.index}</loc><lastmod>${dayjs(item.mtime).format('YYYY-MM-DD')}</lastmod><changefreq>monthly</changefreq></url>` : ''
                sitemap.push(text2)


                if (item.index !== 0 && !!item.upload) {
                    const path = item.path.split('/')
                    const category = path[path.length - 2].split('_')[0]

                    const text3 = `<a href="${utils.path.build}/post/${item.index}${env === 'dev' ? '.html' : ''}">${category} / ${item?.title || item?.file}</a>`
                    recentPost.push(text3)

                    if (recentPost.length > 3) {
                        recentPost.shift()
                    }
                }

                if (parseInt(item.index)) {
                    index++
                }

                // ballboy / create index.md / 포스팅 리스트 레이아웃을 따로 제작하는 방향으로 개선
                // if (item.upload) {
                //     const text2 = `|[ ${item.index} ]|[${item?.title || item?.file}](${utils.path[env]}/post/${item.index}${env === 'dev' ? '.html' : ''})|${item.date}|`
                //     utils.postingList.push(text2)
                // }

                let font = ''
                if (item.upload && parseInt(item.index) !== 0) {
                    font = '\x1b[36m%s\x1b[0m'
                } else if (!item.upload && parseInt(item.index) !== 0) {
                    font = '\x1b[33m%s\x1b[0m'
                } else {
                    font = '\x1b[31m%s\x1b[0m'
                }

                console.log(font, `[ ${item.index}${status ? '*' : ''} ] ${item?.title || item?.file}`);
            }

            fs.writeFileSync(`${utils.path[!!process.env.TEST ? 'mdTest' : 'post']}/postList.md`, posting.join('\n'))
            fs.writeFileSync(`${utils.path.dist}/postList.html`, marked.parse(posting.join('\n')))

            fs.writeFileSync(`${utils.path.dist}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.join('\n')}</urlset>`)
            fs.writeFileSync(`${utils.path.dist}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: https://ballboyDev.github.io/sitemap.xml`)
            fs.writeFileSync(`${utils.path.dist}/recentPost.json`, JSON.stringify(recentPost))

        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }

    }
}

app.run()