import React, { useState } from 'react'

import File from './file'
import './styles.scss'

const Folder = ({ title, path, tree }) => {
    const [open, setOpen] = useState(false)

    const items = Object.keys(tree)

    const onClick = () => {
        console.log(`ballboy ${title} >>>`, path, tree)
        setOpen(!open)
    }

    return (
        <div className={'Folder'}>
            <div className={'Folder__title'} onClick={onClick}>
                <div>{open ? '▼' : '▶'}&nbsp;&nbsp;</div>
                <div >{title}</div>
            </div>
            {
                open && items.map((v, i) => {
                    return (
                        !(tree[v]?.type === 'post') ?
                            <Folder key={`${v}${i}`} title={v} path={`${path}/${v}`} tree={tree[v]} /> :
                            <File key={`${v}${i}`} title={v} path={`${path}/${v}`} tree={tree[v]} />
                    )
                })
            }
        </div>

    )
}

export default Folder