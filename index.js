const core = require('./_utils/core')
const config = require('./config2.json')

const main = {
    init: () => {
        console.log('ballboy >> init')

        // 1. 기준 데이터 생성
        const postList = core.createBaseData()

        // 2. component 생성
        const temp = core.createComponent(postList)

        // 3. 통합 page html 코드 생성
        // 4. 빌드 경로 및 html 파일 생성


    }
}['init']()