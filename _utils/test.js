const path = require('path')

module.exports = {
    init: () => {
        console.log('\n>>>>> process.env')
        // console.log(process.env)

        console.log('\n>>>>> path')
        // console.log(path)

        // console.log(path.dirname('.'))
        // console.log(path.basename('.'))
        // console.log(path.extname('.'))

        console.log(process.env.PWD)
        console.log(__dirname)
        console.log(__filename)

        console.log(__dirname)
    }
}