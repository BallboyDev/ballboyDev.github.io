const path = require('path')
const config = require(`${process.env.PWD}/config.json`)

const postPage = {
    head: (param) => {
        return `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <link rel="stylesheet"
        href="${path.join(config.styleUrl, 'styles.css')}">
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css"
        integrity="sha512-h/laqMqQKUXxFuu6aLAaSrXYwGYQ7qk4aYCQ+KJwHZMzAGaEoxMM6h8C+haeJTU1V6E9jrSUnjpEzX23OmV/Aw=="
        crossorigin="anonymous" referrerpolicy="no-referrer">
    <style>
        ${param.style}
    </style>
</head>
`
    },
    body: (param) => {
        return `
<body>
    <div class="ballboy">
        <div class="ballboy-nav">
            <input class="search" type="text" placeholder="search" />
            <a class="link"
                href="${config.projectUrl}">
                <div class="click index-page">BallboyDev</div>
            </a>
            <div class="items">
                ${param.navigator}
            </div>
        </div>
        <div class="ballboy-main">
            <div class="post markdown-body">
                ${param.post}
            </div>
        </div>
    </div>
    <div class="up">+</div>
</body>
        `
    },

    init: (pageParam) => {
        return `
<!DOCTYPE html><html lang="en">
    ${postPage.head(pageParam)}
    ${postPage.body(pageParam)}
</html>`
    }
}

module.exports = postPage