// Node.js의 파일 시스템 모듈 (파일 읽기/쓰기/삭제 등)
const fs = require('fs')
// Node.js의 경로 모듈 (파일 및 디렉토리 경로 처리)
const path = require('path')
// Marked 라이브러리 (마크다운을 HTML로 변환)
const { marked } = require('marked')
// gray-matter 라이브러리 (마크다운 파일의 YAML front-matter 파싱)
const matter = require('gray-matter')
// dayjs 라이브러리 (날짜 및 시간 처리)
const dayjs = require('dayjs')
// axios 라이브러리 (HTTP 요청 처리)
const { default: axios } = require('axios')

// 사용자 정의 레이아웃 모듈 (게시물 렌더링)
const post = require('./_layout/post')
// 사용자 정의 레이아웃 모듈 (커스텀 마크다운 처리)
const custom = require('./_layout/custom')

// 현재 Node.js 환경 변수 (예: 'dev', 'build', 'tistory')
const env = process.env.NODE_ENV
// 처리할 특정 파일 (CLI 인자로 전달될 경우)
const FILE = process.argv[2] || 0;

// 유틸리티 및 설정 값들을 포함하는 모듈
const utils = require('./config')

// 메인 애플리케이션 로직을 담고 있는 객체
const app = {
    // 애플리케이션을 실행하는 비동기 함수
    run: async () => {
        // 현재 환경(dev, build 등)을 콘솔에 표시
        console.log('\x1b[43m\x1b[30m%s\x1b[0m', `##### [ app.run < ${env} > ] #####`)

        // 환경 초기화
        await app.init()
        // 사용자 정의 마크다운 처리 (예: 추가적인 변환이나 전처리)
        await custom.markdown(utils.path)
        // 포스팅 데이터를 JSON으로 생성
        await app.mkJson();
        // 네비게이션 구조 생성
        await app.mkNavi();
        // 메인 페이지 (index.html) 생성
        await app.mkMainPage();
        // 개별 포스트 페이지 생성
        await app.mkPostPage();
        // 최종 작업 (sitemap, posting list 등)
        await app.finalWork();
    },
    // 초기화 함수: 빌드 디렉토리 설정 및 에셋 복사
    init: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.init ] #####')

        try {
            // dist 디렉토리가 존재하면 삭제하고 다시 생성 (클린 빌드)
            if (fs.existsSync(utils.path.dist)) {
                fs.rmSync(utils.path.dist, { recursive: true })
            }
            // 필요한 빌드 디렉토리 생성
            fs.mkdirSync(`${utils.path.dist}`)
            fs.mkdirSync(`${utils.path.dist}/post`)
            fs.mkdirSync(`${utils.path.dist}/${utils.path.secret}`)
            fs.mkdirSync(`${utils.path.dist}/assets`)
            fs.mkdirSync(`${utils.path.dist}/assets/img`)

            // 에셋 파일들을 dist 디렉토리로 복사
            fs.copyFileSync(`${utils.path.assets}/skin.css`, `${utils.path.dist}/assets/skin.css`)
            fs.copyFileSync(`${utils.path.assets}/markdown.css`, `${utils.path.dist}/assets/markdown.css`)
            fs.copyFileSync(`${utils.path.assets}/skin.js`, `${utils.path.dist}/assets/skin.js`)
            // 개발 환경일 경우 env.js 복사
            if (env === 'dev') {
                fs.copyFileSync(`${utils.path.assets}/env.js`, `${utils.path.dist}/assets/env.js`)
            }
            // 이미지 에셋 디렉토리 전체 복사
            fs.cpSync(`${utils.path.assets}/img/`, `${utils.path.dist}/assets/img/`, { recursive: true })
            // 마크다운 문서 내의 이미지 에셋 복사
            fs.cpSync(`${utils.path[!!process.env.TEST ? 'mdTest' : 'post']}/docsImg/`, `${utils.path.dist}/assets/img/`, { recursive: true })


            console.log('>> set Environment <<')
            console.group('set Path')
            console.log(`index: ${utils.path.post}/index.md`)
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
    // 마크다운 파일들을 읽어 JSON 데이터로 변환하는 함수
    mkJson: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.mkJson ] #####')

        try {
            // 디렉토리를 재귀적으로 탐색하며 마크다운 파일을 처리
            const recursion = (root, fold = []) => {
                const temp1 = {} // 게시물 및 디렉토리 구조를 저장
                const temp2 = {} // 업로드될 게시물의 경로를 저장

                // .DS_Store와 같은 공통 파일을 제외하고 디렉토리 내용을 읽어옴
                const post = fs.readdirSync(root).filter((v) => { return utils.commonFile.indexOf(v) < 0 })

                // 파일 및 디렉토리를 정렬 (디렉토리가 먼저 오고 그 다음 파일, 인덱스 순)
                post.sort((a, b) => {
                    const aType = path.extname(a)
                    const bType = path.extname(b)

                    if (aType === bType) {
                        return a.length - b.length
                    } else {
                        if (aType === '') { // 디렉토리
                            return 1
                        } else { // 파일
                            return -1
                        }
                    }
                }).map((v) => {
                    const isDir = fs.statSync(`${root}/${v}`).isDirectory();

                    if (isDir) {
                        // 디렉토리 이름에서 제목과 인덱스 추출
                        const [title, tempIdx] = path.basename(v, path.extname(v)).split('_');

                        // 개발 환경에서 인덱스가 0인 디렉토리도 네비게이션에 표시하기 위해 임시 인덱스 할당
                        const index = parseInt(tempIdx) === 0 ? `T${Math.floor(Math.random() * 9999)}` : tempIdx

                        // 개발 환경이거나 빌드/티스토리 환경에서 인덱스가 0이 아닌 경우에만 처리
                        if (env === 'dev' || (['build', 'tistory'].includes(env) && parseInt(tempIdx) !== 0)) {
                            // 하위 디렉토리를 재귀적으로 탐색
                            const [child, json] = recursion(`${root}/${v}`, [...fold, index]);
                            // 하위 게시물 및 디렉토리의 개수 계산
                            const count = Object.keys(child).reduce((a, b) => {
                                const [type, index] = b.split('_');
                                return a + (
                                    type === 'dir' ?
                                        child[b].count :
                                        (
                                            parseInt(child[b].index) !== 0 && (env === 'dev' || (['build', 'tistory'].includes(env) && child[b].upload)) ? 1 : 0
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
                        // 마크다운 파일 처리
                        const mdFile = matter(fs.readFileSync(`${root}/${v}`, 'utf8').trim());
                        const { birthtime, mtime } = fs.statSync(`${root}/${v}`)
                        const title = mdFile.data?.title;
                        const index = mdFile.data?.index || 0;
                        const upload = mdFile.data?.upload || false;

                        if (v !== '.DS_Store') {
                            // Marked를 사용하여 마크다운 내용을 토큰화
                            const token = marked.lexer(mdFile.content).map((v, i) => { return { index: i, ...v } })

                            const item = {
                                title,
                                file: path.basename(v, path.extname(v)),
                                index: parseInt(index),
                                path: `${root}/${v}`,
                                fold, // 상위 디렉토리 인덱스 배열
                                date: !!mdFile.data?.date ? dayjs(`${mdFile.data?.date}`, 'YYYYMMDD').format("YYYY-MM-DD HH:mm:ss") : dayjs(birthtime),
                                birthtime, mtime,
                                token: token,
                                bookmark: token.filter((v) => { return v.type === 'heading' && v.depth <= 3 }), // 목차 (h1, h2, h3) 추출
                                ...mdFile.data, // front-matter 데이터 포함
                            };

                            temp1[`post_${index}`] = item;
                            // 업로드 플래그가 true인 경우에만 경로 저장
                            if (upload) {
                                temp2[`${title || path.basename(v, path.extname(v))}`] = `${utils.path.build}/post/${parseInt(index)}`
                            }

                            // 티스토리 환경이고 특정 파일만 처리하는 경우
                            if (env === 'tistory') {
                                if (index === parseInt(FILE)) {
                                    utils.contents.push(item);
                                }
                            } else {
                                utils.contents.push(item);
                            }

                        }
                    }
                })

                return [temp1, temp2]
            }

            // 마크다운 디렉토리를 재귀적으로 탐색하여 게시물 및 JSON 데이터 생성
            [utils.post, utils.json] = [...recursion(utils.path[!!process.env.TEST ? 'mdTest' : 'post'])]

            console.log('ballboy >> utils.json, utils.post, utils.content')

            // 개발 또는 테스트 환경일 경우 test.json 파일 생성
            if (env === 'dev' || env === 'test') {
                fs.writeFileSync(`test.json`, JSON.stringify(utils.contents))
            }

            // 생성된 JSON 데이터를 파일로 저장
            fs.writeFileSync(`${utils.path.dist}/post.json`, JSON.stringify(utils.json))
        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }

    },
    // 네비게이션 메뉴를 생성하는 함수
    mkNavi: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.mkNavi ] #####')

        try {
            const tagList = [] // 네비게이션 HTML 태그들을 저장할 배열

            // 재귀적으로 게시물 구조를 탐색하며 네비게이션 항목 생성
            const recursion = (root) => {
                const item = Object.keys(root)

                // 인덱스 및 타입에 따라 정렬 (게시물이 먼저 오고, 디렉토리는 나중에)
                item.sort((a, b) => {
                    const [aType, aIndex] = a.split('_')
                    const [bType, bIndex] = b.split('_')

                    if (aType === bType) { // 같은 타입이면 인덱스로 정렬
                        return parseInt(aIndex) - parseInt(bIndex)
                    } else { // 타입이 다르면 게시물을 먼저
                        if (aType === 'post') {
                            return -1
                        } else {
                            return 1
                        }
                    }
                }).map((v) => {
                    const [type, num] = v.split('_')

                    if (type === 'dir') {
                        // 디렉토리 항목 (폴더) 생성
                        tagList.push(`<li id="dt-${num}" ${num.indexOf('T') >= 0 ? "class='dt-temp'" : ''} onclick="foldNavi('${num}')">${root[v].title} (${root[v].count})</li>`)
                        tagList.push(`<ul id="dc-${num}" class='dc-all' style="display: ${parseInt(num) === 1 ? 'block' : 'none'};">`)
                        tagList.push(recursion(root[v].children)) // 하위 디렉토리 재귀 호출
                        tagList.push('</ul>')
                    } else {
                        // 게시물 항목 생성 (인덱스가 0이 아니고, 개발 환경이거나 업로드 가능한 빌드 환경일 경우)
                        if (parseInt(root[v].index) !== 0 && (env === 'dev' || (env === 'build' && root[v].upload))) {
                            tagList.push(`<a href="${utils.path[env]}/post/${root[v].index}${env === 'dev' ? '.html' : ''}">`)
                            tagList.push(`<li id="p-${root[v].index}">• ${root[v]?.title || root[v]?.file}</li>`)
                            tagList.push(`</a>`)
                        }
                    }
                })

                return tagList
            }

            // 재귀 함수 호출하여 네비게이션 생성
            recursion(utils.post)
            // 생성된 네비게이션 HTML 태그들을 utils.navi에 저장
            utils.navi = tagList
        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }
    },
    // 메인 페이지 (예: index.html)를 생성하는 함수
    mkMainPage: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.mkMainPage ] #####')

        try {
            // 개별 마크다운 파일을 읽어 HTML 페이지로 변환
            const mkList = (file) => {
                const mdFile = matter(fs.readFileSync(`${utils.path.post}/${file}`, 'utf8').trim())
                const content = `${mdFile.content}`
                const htmlFile = marked.parse(content) // 마크다운을 HTML로 파싱

                const metaData = {
                    env: env, // 환경 변수 (dev, build 등)
                    url: utils.path[env], // 현재 환경의 URL
                    fold: [], // 폴드 정보 (메인 페이지는 폴드 없음)
                    navi: utils.navi, // 네비게이션 HTML
                    contents: htmlFile // 변환된 HTML 콘텐츠
                }

                const result = post.output(metaData) // 레이아웃에 메타데이터와 콘텐츠를 넣어 최종 HTML 생성
                const postInfo = path.parse(file) // 파일 경로 정보 파싱

                // 생성된 HTML 파일을 dist 디렉토리에 저장
                fs.writeFileSync(`${utils.path.dist}/${!!postInfo.dir ? `${utils.path.secret}/${postInfo.name}` : postInfo.name}.html`, result)

                console.log('\x1b[36m%s\x1b[0m', `[ ${!!postInfo.dir ? `${postInfo.dir} / ${utils.path.secret}` : '/'} ] ${postInfo.name}`);
            }

            // 처리할 파일 목록 (index.md 및 secret 디렉토리의 파일들)
            const fileList = ['index.md', ...fs.readdirSync(`${utils.path.post}/secret`).map((v) => { return `secret/${v}` })]

            // 각 파일을 순회하며 페이지 생성
            fileList.map((file) => {
                mkList(file)
            })

        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }

    },
    // 개별 게시물 페이지를 생성하는 함수
    mkPostPage: () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.mkPostPage ] #####')


        try {
            utils.contents.sort((a, b) => { // 게시물을 인덱스 순으로 정렬
                return a.index - b.index
            }).filter((v) => { // 필터링: 인덱스가 0이 아니고, (개발 환경이거나 업로드 가능한 빌드 환경이거나 특정 티스토리 파일)

                return parseInt(v.index) !== 0 && (
                    env === 'dev'
                    || (env === 'build' && v.upload)
                    || env === 'tistory' && v.index === parseInt(FILE)
                )

            }).map((v) => { // 각 게시물에 대해 HTML 페이지 생성

                // 마크다운 토큰을 HTML로 파싱
                const htmlFile = marked.parser(v.token)

                const metaData = {
                    title: v?.title || v.file, // 게시물 제목
                    env: env, // 환경 변수
                    url: utils.path[env], // 현재 환경 URL
                    index: v.index, // 게시물 인덱스
                    fold: v.fold, // 폴드 정보
                    navi: utils.navi, // 네비게이션 HTML
                    contents: htmlFile, // 변환된 HTML 콘텐츠
                    bookmark: v.bookmark, // 목차 정보
                    comment: v.comment, // 댓글 정보
                    link: v.link // 링크 정보
                }

                // 레이아웃에 메타데이터와 콘텐츠를 넣어 최종 HTML 생성
                const result = post.output(metaData)

                // 생성된 HTML 파일을 dist/post 디렉토리에 저장
                fs.writeFileSync(`${utils.path.dist}/post/${v.index}.html`, result)

                // console.log(metaData.title)
                console.log(metaData.title.normalize('NFC').replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s]/g, '').replaceAll('  ', ' ').replaceAll(' ', '-'))

                // const fileName = metaData.title.normalize('NFC').replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s]/g, '').replaceAll('  ', ' ').replaceAll(' ', '-')

                // fs.writeFileSync(`${utils.path.dist}/post/${fileName}.html`, result)

            })
        } catch (err) {
            console.log(err)
        } finally {
            console.groupEnd()
            console.log('Done!!!')
        }
    },
    // 모든 페이지 생성 후 최종 작업을 수행하는 함수
    finalWork: async () => {
        console.group('\x1b[43m\x1b[30m%s\x1b[0m', '\n##### [ app.finalWork ] #####')

        console.log('\x1b[36m[ 배포* ]  \x1b[36m[ 배포대기 ]  \x1b[33m[ 작성중 ]  \x1b[31m[ 기획중 ]\x1b[0m\n')

        try {
            const posting = [`# Posting List (${dayjs().format("YYYY.MM.DD")})\n`, '||index|title|date|prev|next|github|tistory|', '|:-:|:-:|:--|:-:|:-:|:-:|:--|:--|']

            // sitemap.xml에 들어갈 URL 목록
            const sitemap = [`<url><loc>${utils.path.build}/</loc><lastmod>${dayjs().format('YYYY-MM-DD')}</lastmod><priority>1.0</priority></url>`]

            // 최근 게시물 목록
            const recentPost = []

            // 게시물 순서 번호
            let index = 1;

            for (let i = 0; i < utils.contents.length; i++) {
                const item = utils.contents[i]
                let status = false // 게시물 배포 상태
                try {
                    // 게시물의 실제 배포 여부 확인
                    let temp = await axios.get(`${utils.path.build}/post/${item.index}.html`)
                    status = temp.status === 200
                } catch (err) {
                    if (err.status !== 404) {
                        console.log(`ERROR [${err.status}] >> ${item?.title || item?.file || 'no file'}`)
                    }
                }

                // posting.md 생성을 위한 데이터 준비
                const [prev, next] = !!item?.link ? item.link.split('/') : [0, 0]

                const i_count = `${parseInt(item.index) === 0 ? '0' : index}`
                const i_index = `[ ${item.index} ]`
                const i_title = `${item?.title || item?.file}`
                const i_date = `${item.date}`
                const i_prev = `${parseInt(prev) !== 0 ? prev : ''}`
                const i_next = `${parseInt(next) !== 0 ? next : ''}`
                const i_github = `${status}` // 배포 상태
                const i_tistory = `${item.tistory}` // 티스토리 링크
                // const i_tistory = item.tistory === 'false' ? 'false' : `![${item.tistory}](https://ballboydev.tistory.com/${item.tistory})`

                // console.log(parseInt(item.tistory))

                // const t = 

                const text1 = `|${i_count}|${i_index}|${i_title}|${i_date}|${i_prev}|${i_next}|${i_github}|${i_tistory}|`
                posting.push(text1)

                // sitemap.xml 생성을 위한 데이터 준비
                const text2 = item.index !== 0 && !!status ? `<url><loc>${utils.path.build}/post/${item.index}</loc><lastmod>${dayjs(item.mtime).format('YYYY-MM-DD')}</lastmod><changefreq>monthly</changefreq></url>` : ''
                sitemap.push(text2)


                // 최근 게시물 목록 생성
                if (item.index !== 0 && !!item.upload) {
                    const path = item.path.split('/')
                    const category = path[path.length - 2].split('_')[0]

                    const text3 = `<a href="${utils.path.build}/post/${item.index}${env === 'dev' ? '.html' : ''}">${category} / ${item?.title || item?.file}</a>`
                    recentPost.push(text3)

                    // 최근 게시물은 3개까지만 유지
                    if (recentPost.length > 3) {
                        recentPost.shift()
                    }
                }

                if (parseInt(item.index)) {
                    index++
                }

                // 게시물 상태에 따른 콘솔 출력 색상 설정
                let font = ''
                if (item.upload && parseInt(item.index) !== 0) {
                    font = '\x1b[36m%s\x1b[0m' // 배포* (파란색)
                } else if (!item.upload && parseInt(item.index) !== 0) {
                    font = '\x1b[33m%s\x1b[0m' // 작성중 (노란색)
                } else {
                    font = '\x1b[31m%s\x1b[0m' // 기획중 (빨간색)
                }

                console.log(font, `[ ${item.index}${status ? '*' : ''} ] ${item?.title || item?.file}`);

                if (env === 'tistory') {
                    console.log('\x1b[32m%s\x1b[0m', item.tag.reduce((a, c) => { return `${a}, ${c}` }), '\n')
                }
            }

            // posting.md, postingList.html 생성
            fs.writeFileSync(`${utils.path[!!process.env.TEST ? 'mdTest' : 'post']}/postList.md`, posting.join('\n'))
            fs.writeFileSync(`${utils.path.dist}/postList.html`, marked.parse(posting.join('\n')))

            // sitemap.xml, robots.txt, recentPost.json 생성
            // app.js 수정 제안
            const filteredSitemap = sitemap.filter(url => url !== '');
            fs.writeFileSync(`${utils.path.dist}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${filteredSitemap.join('\n')}</urlset>`);
            fs.writeFileSync(`${utils.path.dist}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: https://ballboydev.github.io/sitemap.xml`)
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