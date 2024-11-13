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
            baseUrl: baseUrl,
            postPath: path.join(baseUrl, '_markdown'),
            buildPath: path.join(baseUrl, '_build')
        }

        return json
    },
    prd: () => {
        console.log('_utils/config.prd()')
    }


}

config.init()