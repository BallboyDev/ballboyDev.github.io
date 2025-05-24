const assets = (param) => {
    const { assetsUrl, index, fold } = param

    const html = `
<link rel="stylesheet" href="${assetsUrl}/markdown.css">
<link rel="stylesheet" href="${assetsUrl}/skin.css">

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

<script src="${assetsUrl}/skin.js"></script>
    `

    return html
}

const prev = (param) => {
    const { url, prev } = param

    const html = `
<a href="${url}/post/${prev}.html" class="prev post">
    <img src="${url}/assets/img/prev.svg" alt="" srcset="">
</a>
    `

    return html
}
const next = (param) => {
    const { url, next } = param

    const html = `
<a href="${url}/post/${next}.html" class="next post">
    <img src="${url}/assets/img/next.svg" alt="" srcset="">
</a>
    `

    return html
}

const bookmark = (param) => {
    const html = `
<div class="bookmark">
    <div class="title t1">
        <div><a href="http://ballboydev.github.io">아름다운 이 강산을</a></div>
        <p>•</p>
    </div>
    <div class="title t2">
        <div><a href="http://ballboydev.github.io">지키는 우리 사나이 기백으로</a></div>
        <p>•</p>
    </div>
    <div class="title t3">
        <div><a href="http://ballboydev.github.io">오늘을 산다 포탄의 불바다를</a></div>
        <p>•</p>
    </div>
    <div class="title t1">
        <div><a href="http://ballboydev.github.io">무릅쓰고서 고향 땅</a></div>
        <p>•</p>
    </div>
    <div class="title t2">
        <div><a href="http://ballboydev.github.io">부모 형제 평화를</a></div>
        <p>•</p>
    </div>
    <div class="title t3">
        <div><a href="http://ballboydev.github.io">위해</a></div>
        <p>•</p>
    </div>
</div>
    `

    return html
}

const page = (param) => {
    const { data, tag } = param

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-site-verification" content="jrh7qB1kgowvnvE0P3KqlhI-iNmw9CvGJF4dQsaCTAk" />
    <title>심심한 개발자의 취미 생활에 오신걸 환영합니다.</title>

    ${tag.assets}
</head>

<body>
    <div id="wrapper">
        <!-- side bar component -->
        <div id="head-bar">
            <img id="openNavi" class="img"
                src="${data.url}/assets/img/profile.jpeg"
                alt="" srcset="">
            <div class="title">심심한 개발자의 취미생활</div>
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
            
            <h3 class="category">카테고리</h3>
            <div class="navi">
                <ul class="root">

                    ${tag.navi}

                </ul>
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
        </div>
    </div>
</body>

</html>
    `

    return html
}

const output = (param) => {
    const env = process.env.NODE_ENV

    const temp = {
        data: {
            url: param.url,
            index: param.index,
            env: param.env
        },
        tag: {
            assets: assets({
                assetsUrl: env === 'dev' ? `${process.cwd()}/_assets` : `${param.url}/assets`,
                index: param.index,
                fold: param.fold
            }),
            prev: (param.prev !== 0) ? prev({ url: param.url, prev: param.prev }) : '',
            next: (param.next !== 0) ? next({ url: param.url, next: param.next }) : '',
            navi: param.navi.join('\n'),
            bookmark: bookmark({}),
            contents: param.contents,
        }
    }


    return page(temp)
}

module.exports = {
    output
}