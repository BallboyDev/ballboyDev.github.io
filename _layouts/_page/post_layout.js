const path = require('path')
const config = require(`${process.env.PWD}/config.json`)
const env = config[process.env.NODE_ENV]

const layout = (param) => (`
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${env.title}</title>
        <link rel="stylesheet"
            href="${env.style_url}">
        <link rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css"
            integrity="sha512-h/laqMqQKUXxFuu6aLAaSrXYwGYQ7qk4aYCQ+KJwHZMzAGaEoxMM6h8C+haeJTU1V6E9jrSUnjpEzX23OmV/Aw=="
            crossorigin="anonymous" referrerpolicy="no-referrer">
        <style>
            ${param.style}
        </style>
    </head>
    
    <body>
        <div class="ballboy">
            <div class="ballboy-nav">
                <input class="search" type="text" placeholder="search" />
                <a class="link"
                    href="${path.join(process.env.PWD, ...config.mainPath, "main.html")}">
                    <div class="click home">home</div>
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
</html>
`)

module.exports = layout