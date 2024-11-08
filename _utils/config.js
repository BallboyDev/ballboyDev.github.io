const path = require('path')
const fs = require('fs')

const configUtil = {
    init: () => {
        console.log('### starting >> configUtil.init()')
        // const config = configUtil.getConfig()

        // configUtil.createConfig(config)
    },

    getConfig: () => {
        const baseUrl = process.cwd()
        const config = {
            baseUrl,
            postPath: ["_markdown", "_posts"],
            buildPath: ["_build", "_posts"],
            pathAlias: {
                _assets: path.join(baseUrl, '_assets'),
                _layouts: path.join(baseUrl, '_layout'),
                _utils: path.join(baseUrl, '_utils')
            },
            dev: {
                title: "ballboy's blog - develop version",
                style_url: path.join(baseUrl, '_assets', 'styles.css')
            },
            prd: {
                title: "ballboy's dev blog",
                style_url: "https://cdn.jsdelivr.net/gh/ballboyDev/lazy-developer-is-great-developer/front-template/blog-ver2-template/style.css"
            },
        }

        return config
    },

    createConfig: (config) => {
        fs.writeFileSync(path.join(config.baseUrl, 'config.json'), JSON.stringify(config))
    }
}

configUtil.init()
