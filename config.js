const dayjs = require('dayjs')

const utils = {
    path: {
        // index.md 파일 위치
        index: '/Users/ballboy/Documents/blog/index.md', // _post/index.md

        // 포스팅 글 저장 위치
        post: '/Users/ballboy/Documents/blog', // _post

        // 배포 위치
        dist: '_dist',

        // 이미지, css, js 파일 등 구성 요소 저장 공간 위치
        assets: '_assets',

        // 마크다운 변환 커스텀 환경 개발 테스트
        mdTest: '_test',

        // 테스트 환경 배포 경로
        dev: `file://${__dirname}/_dist`,

        // 운영 환경 배포 경로
        build: 'https://ballboyDev.github.io'

    },
    post: {},           // 블로그 생성을 위한 기초 json 데이터
    json: {},           // 단축어 등 외부 기능 활용을 위한 포스팅 글 URL 제공 json 데이터
    navi: [],           // 네비게이션 HTML 베이스 코드
    contents: [],       // 포스팅 글 관련 정보 리스트
    postingList: [      // 정규화된 포스팅 글 리스트
        `## Posting List (${dayjs().format("YYYY.MM.DD")})`,
        '||title|date|',
        '|:-:|:--|:-:|'
    ],
    commonFile: [       // 적용 예외 공통 파일
        '_Common',      // 공통 사용 폴더
        'docsImg',      // 포스팅 글에 첨부되는 이미지 모음 폴더
        'index.md',     // index 페이지 마크다운 파일
        'postList.md',  // 포스팅 글 리스트 정리 파일
        'deploy.sh',     // 원격 배포 파일
    ]
}


module.exports = {
    ...utils
}