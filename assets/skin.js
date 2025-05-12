window.onload = () => {
    console.log('run skin.js')

    // const categoryList = []
    // const liList = document.getElementsByClassName('cate')

    // for (let i = 0; i < liList.length; i++) {
    //     categoryList.push(liList[i].getAttribute('id').split('-')[1])
    // }

    // categoryList.map((v) => {
    //     const item = document.getElementById(`t-${v}`)
    //     item.onclick = () => {
    //         const category = document.getElementById(`c-${v}`)
    //         if (category.style.display === 'none') {
    //             category.style.display = 'block'
    //         } else {
    //             category.style.display = 'none'
    //         }

    //     }
    // })

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

    const { fold } = JSON.parse(document.getElementById("data").text)
    fold.map((v) => {
        document.getElementById(`dc-${v}`).style.display = "block"
    })


};

const foldNavi = (num) => {
    const ulTag = document.getElementById(`dc-${num}`)
    if (ulTag.style.display === "block") {
        ulTag.style.display = "none"
    } else {
        ulTag.style.display = "block"
    }
}

const postList = () => {
    location.href = 'https://www.naver.com'
}