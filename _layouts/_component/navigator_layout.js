const path = require('path')
const { buildPath } = require(`${process.env.PWD}/config.json`)

const navigator = {
    item: (item) => (`<a class="link" href="${path.join(process.env.PWD, ...buildPath, ...item.href, `${item.name}.html`)}"><div class="item click ${item.key}">${item.name}</div></a>`),
    open: (item) => (`<div class="folder"><div class="title click">${item.name}</div>`),
    close: (item) => (`</div>`)
}

module.exports = navigator