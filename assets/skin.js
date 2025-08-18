window.onload = async () => {
    console.log('run skin.js')

    // 모바일 환경에서 네비게이션 open/close
    const contents = document.getElementById('contents')
    const navi = document.getElementById('side-bar')
    const openNavi = document.getElementById('openNavi')
    openNavi.onclick = () => {
        navi.style.display = 'flex'
        contents.style.display = 'none'
    }
    const closeNavi = document.getElementById('closeNavi')
    closeNavi.onclick = () => {
        navi.style.display = 'none'
        contents.style.display = 'block'
    }

    // 현제 페이지 경로대로 네비게이션 아이템 열기
    const { fold } = JSON.parse(document.getElementById("data").text)
    fold.map((v) => {
        document.getElementById(`dc-${v}`).style.display = "block"
    })


    if (!!localStorage.getItem('env')) {
        const temps = document.getElementsByClassName('dt-temp')
        for (let t of temps) {
            t.style.display = 'none'
        }
    }

    // 베이스 데이터 조회 (최근 올라온 글 등)
    // console.log(window.location.pathname)
    // if (window.location.pathname.indexOf('index') >= 0) {
    await getBaseData()
    // }


};

const getBaseData = async () => {
    // console.log('getBaseData')
    const res = await fetch("https://ballboydev.github.io/recentPost.json")
    const data = await res.json()

    const tag = document.getElementById("recentPost")

    data.map((v) => { tag.innerHTML += `<li>${v}</li>` })
}

const foldNavi = (index = '0') => {

    if (index !== '0') {
        const ulTag = document.getElementById(`dc-${index}`)
        if (ulTag.style.display === "block") {
            ulTag.style.display = "none"
        } else {
            ulTag.style.display = "block"
        }
    } else {
        const ulTags = document.getElementsByClassName('dc-all')
        for (let ulTag of ulTags) {
            ulTag.style.display = "none"
        }
    }
}

const postList = () => {
    location.href = 'https://www.naver.com'
}