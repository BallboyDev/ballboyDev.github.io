console.log('run env.js')

const settingBox = () => {
    const setBox = document.getElementById('set-box')

    if (setBox.style.display === "block") {
        setBox.style.display = "none"
    } else {
        setBox.style.display = "block"
    }

}

const setEnvironment = () => {
    const setList = {
        env: env
    }

    Object.keys(setList).map((v) => {
        setList[v]()
    })
}

const env = () => {
    let env = localStorage.getItem('env')
    if (!env) {
        localStorage.setItem('env', 'dev')
        env = 'dev'
    }

    document.getElementById(`env-${env}`).style.backgroundColor = 'royalblue'

    document.getElementById(`env-dev`).onclick = () => {
        localStorage.setItem('env', 'dev')
        location.reload(true);
    }
    document.getElementById(`env-prd`).onclick = () => {
        localStorage.setItem('env', 'prd')
        location.reload(true);
    }

    if (env === 'prd') {
        const temps = document.getElementsByClassName('dt-temp')
        for (let t of temps) {
            t.style.display = 'none'
        }
    }

}