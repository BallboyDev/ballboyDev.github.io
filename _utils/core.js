const config = require(`${process.env.PWD}/config2.json`)

module.exports = core = {
    createBaseData: ({ posts, pages } = require(config.postInfo), currentPath = []) => {
        console.log('ballboy >> createBaseData()')
        const postList = []

        Object.keys(posts).map((post, i) => {
            if (typeof posts[post] === 'string') {
                postList.push({
                    type: 'item',
                    name: post,
                    href: [...currentPath, `${post}.md`],
                    key: `select-${Math.random().toString(36).substring(2, 16)}`
                })
            } else {
                postList.push({ type: 'open', name: post, key: -1 })
                postList.push(...core.createBaseData({ posts: posts[post] }, [...currentPath, post]))
                postList.push({ type: 'close', name: post, key: -1 })
            }
        })

        return postList
    },

    createComponent: (postList) => {
        console.log('ballboy >> createComponent()')
        const layouts = require(config.layouts)
        // 2-1. page style 코드 생성


        // 2-2. navigator 코드 생성
        const navigator_html = layouts.navigator.init(postList)

        // 2-3. post page 코드 생성
        postList.map((post) => {
            if (post.type === 'item') {
                const post_html = layouts.post.init(post)
            }

        })

    }
}

