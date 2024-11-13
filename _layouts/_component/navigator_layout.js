const path = require('path')
const config = require(`${process.env.PWD}/config.json`)

const navigator = {
    item: (item) => (`<a class="link" href="${path.join(config.projectUrl, 'post', ...item.href, `${item.name}.html`)}"><div class="item click ${item.key}">${item.name}</div></a>`),

    open: (item) => (`<div class="folder"><div class="title click">${item.name}</div>`),

    close: (item) => (`</div>`),

    init: (postList) => {
        return postList.map((post) => (
            navigator[post.type](post)
        )).join('')
    },
}

module.exports = navigator