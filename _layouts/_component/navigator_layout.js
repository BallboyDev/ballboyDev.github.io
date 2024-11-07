const navigator = {
    item: (item) => (`<a class="link" href=""><div class="item click ${item.key}">${item.name}</div></a>`),
    open: (item) => (`<div class="folder"><div class="title click">${item.name}</div>`),
    close: (item) => (`</div>`)
}

module.exports = navigator