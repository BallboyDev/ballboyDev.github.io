const style = {
    selectedItem: (post) => (`.${post.key} {color: red}`),
    init: (post) => (`
        ${style.selectedItem(post)}
    `)
}

module.exports = style 