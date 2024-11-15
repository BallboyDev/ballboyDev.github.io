const core = require('./_utils/core')
const test = require('./_utils/test')

const main = {
    init: () => {
        console.log('ballboy >> init')

        // 0. 실행 전 빌드 데이터 초기화
        core.initBuild()

        // 1. 기준 데이터 생성
        // 1-1 post 데이터 생성
        const postList = core.createPostData()

        // 1-2 info 데이터 생성
        const infoList = core.createInfoData()

        // 2. component 생성
        const pageParamList = core.createPageParamList({ postList, infoList })


        // 3. 통합 page html 코드 및 파일 생성
        const temp1 = core.createPage(pageParamList)

        // 4. 기타 파일 이동 및 생성
        const temp2 = core.createOthers()

    },
    test: () => {
        test.init()
    }
}['init']()