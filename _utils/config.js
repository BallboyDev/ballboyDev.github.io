const path = require('path')
const fs = require('fs')

const config = {
    init: () => {
        console.log('_utils/config.init()')
        const json = config[process.env.NODE_ENV]()

        fs.writeFileSync(path.join(json.baseUrl, 'config.json'), JSON.stringify(json))
    },

    dev: () => {
        console.log('_utils/config.dev()')
        const baseUrl = process.env.PWD
        const json = {
            favicon: "",
            title: `ballboy's test Blog`,
            baseUrl: baseUrl,
            postPath: path.join(baseUrl, '_markdown'),
            buildPath: path.join(baseUrl, '_build'),
            layoutsPath: path.join(baseUrl, '_layouts'),
            assetsPath: path.join(baseUrl, '_assets'),

            projectUrl: path.join(baseUrl, '_build'),
            styleUrl: path.join(baseUrl, '_assets', 'css')
        }

        return json
    },
    prd: () => {
        console.log('_utils/config.prd()')
        const baseUrl = process.env.PWD
        const json = {
            favicon: "",
            title: `ballboy's Blog`,
            baseUrl: baseUrl,
            postPath: path.join(baseUrl, '_markdown'),
            buildPath: path.join(baseUrl, '_build'),
            layoutsPath: path.join(baseUrl, '_layouts'),
            assetsPath: path.join(baseUrl, '_assets'),

            projectUrl: '/',
            styleUrl: '/static/css'
        }

        return json

    },

}

config.init()