const code = {
    assets: (param) => {
        const { assetsUrl, index, fold } = param

        const html = `
            <link rel="icon" href="${assetsUrl}/img/bDev.ico">
            <link rel="stylesheet" href="${assetsUrl}/markdown.css">
            <link rel="stylesheet" href="${assetsUrl}/skin.css">

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>

            <style>
                #p-${index} {
                    color: rgb(76, 193, 237) !important;
                }
            </style>
            <script id="data" type="application/json">
            {
                "fold": ${JSON.stringify(fold)}
            }
            </script>

            <script src="${assetsUrl}/skin.js"></script>`

        return html
    },

    prev: (param) => {
        const { url, prev } = param

        const html = `
            <a href="${url}/post/${prev}.html" class="prev post">
                <img src="${url}/assets/img/prev.svg" alt="" srcset="">
            </a>`

        return html
    },
    next: (param) => {
        const { url, next } = param

        const html = `
            <a href="${url}/post/${next}.html" class="next post">
                <img src="${url}/assets/img/next.svg" alt="" srcset="">
            </a>`

        return html
    },

    bookmark: (param) => {

        const html = param.reduce((a, b) => {
            return `${a}\n${`
            <div class="title t${b.depth}">
                <div><a href="#bm-${b.index}">${b.raw.replace('\n', '')}</a></div>
                <p>•</p>
            </div>`}`
        }, '')

        return `<div class="bookmark">${html}</div>`
    },

    comment: () => {
        return `
            <script src="https://utteranc.es/client.js"
                repo="ballboyDev/personal-storage"
                issue-term="pathname"
                label="comments"
                theme="github-dark"
                crossorigin="anonymous"
                async>
            </script>`
    },

    page: (param) => {
        const { data, tag } = param

        const html = `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="google-site-verification" content="jrh7qB1kgowvnvE0P3KqlhI-iNmw9CvGJF4dQsaCTAk" />
                <meta name="naver-site-verification" content="6fe49ccdb8613221b89ae2d580300c63a91af446" />
                
                ${tag.assets}

                <title>${data?.title || '심심한 개발자의 취미 생활에 오신걸 환영합니다.'}</title>
            </head>

            <body>
                <div id="wrapper">
                    <!-- side bar component -->
                    <div id="head-bar">
                        <img id="openNavi" class="menu"
                            src="${data.url}/assets/img/menu.svg"
                            alt="" srcset="">
                        <div class="title">심심한 개발자의 취미생활</div>
                        <img class="img"
                            src="${data.url}/assets/img/profile.jpeg"
                            alt="" srcset="">
                    </div>
                    <div id="side-bar">
                        <img id="closeNavi" class="close"
                            src="${data.url}/assets/img/close.svg"
                            alt="" srcset="">
                        <div class="profile">
                            <img class="img" src="${data.url}/assets/img/profile.jpeg" alt="" srcset="">
                            <p>심심한 개발자의 취미생활</p>
                            <p>환영합니다.</p>
                        </div>
                        <hr />
                        <h3 class="home"><a href="${data.url}${data.env === 'dev' ? '/index.html' : ''}">HOME</a></h3>
                        <hr />
                        
                        <h3 class="category" onclick="foldNavi()">카테고리</h3>
                        <div class="navi">
                            <ul class="root">

                                ${tag.navi}

                            </ul>
                        </div>

                        <div class="copyright">
                            <img class="img"
                                src="${data.url}/assets/img/github-mark-white.svg"
                                alt="" srcset="">
                            <a href="https://github.com/BallboyDev/ballboyDev.github.io" target="_blank">Designed by ballboyDev</a>
                        </div>

                    </div>

                    <!-- contents component -->
                    <div id="contents">

                        ${tag.bookmark}
                        
                        ${tag.prev}
                        
                        ${tag.next}
                        
                        <div class="main markdown-body">

                            ${tag.contents}

                        </div>

                        ${tag.comment}

                    </div>
                </div>
            </body>
            </html>`

        return html
    }
}

const output = (param) => {

    const env = process.env.NODE_ENV
    const [prev, next] = !!param?.link ? param.link.split('/') : [0, 0]

    const temp = {
        data: {
            title: param.title,
            url: param.url,
            index: param.index,
            env: param.env
        },
        tag: {
            assets: code.assets({
                assetsUrl: env === 'dev' ? `${process.cwd()}/_assets` : `${param.url}/assets`,
                index: param.index,
                fold: param.fold
            }),
            prev: (parseInt(prev) !== 0) ? code.prev({ url: param.url, prev: prev }) : '',
            next: (parseInt(next) !== 0) ? code.next({ url: param.url, next: next }) : '',
            navi: param.navi.join('\n'),
            bookmark: !!param?.bookmark ? code.bookmark(param.bookmark) : '',
            contents: param.contents,
            comment: !!param?.comment ? code.comment() : ''
        }
    }

    return code.page(temp)
}

module.exports = {
    output
}