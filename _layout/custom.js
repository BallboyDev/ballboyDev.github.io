const { marked } = require('marked')

const custom = {
    heading: (meta) => {
        // console.log(meta)

        return `<h${meta.depth}>${meta.text}</h${meta.depth}>`
    },
    image: (meta) => {
        console.log(meta)
        return '<p><img src="file:///Users/ballboy/workspace/project/ballboyDev.github.io/_dist/assets/img/11_1.jpeg" alt="이미지 준비중"></p>'
    }
}

const markdown = () => {
    const renderer = new marked.Renderer()

    renderer.heading = custom.heading
    // renderer.image = custom.image

    marked.setOptions({ renderer: renderer })
}

module.exports = {
    markdown
}