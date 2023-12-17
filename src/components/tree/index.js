import { useEffect } from 'react'

import tempData from './blog.json'
import './styles.scss'
import Root from './root'

const Tree = () => {
    const roots = Object.keys(tempData)

    return (
        <div className={'FileTree'}>
            <div className={'FileTree__buttonGroup'}>
                <div className={''} onClick={() => {
                    console.log(process.env.REACT_APP_GITHUB_URL)
                }} >
                    1
                </div>
                <div className={''} onClick={() => { }}>
                    2
                </div>
                <div className={''} onClick={() => { }}>
                    3
                </div>
                <div className={''} onClick={() => { }}>
                    4
                </div>
            </div>
            <div>
                {
                    roots.map((v, i) => {
                        return (
                            <Root key={`${v}${i}`} title={v} tree={tempData[v]} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Tree;