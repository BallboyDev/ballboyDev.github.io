import React, { useState, useEffect } from 'react'
import './styles.scss'
import Folder from './folder'
import File from './file'
import { ArrowRightIcon } from '../../common/icon'

const Root = ({ data, selectItem }) => {
    const { title, desc, id, type } = data
    const { _include } = data
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const openItem = ((localStorage.getItem('openItem') || '|').indexOf(`|${id}|`) >= 0)
        setIsOpen(openItem)
    }, [])

    const onClick = () => {
        setIsOpen(() => {
            const openItem = localStorage.getItem('openItem')
            if (!isOpen) {
                localStorage.setItem('openItem', `${openItem}${id}|`)
            } else {
                localStorage.setItem('openItem', openItem.replaceAll(`|${id}|`, '|'))
            }
            return !isOpen
        })
    }

    return (
        <div className={'Root'}>
            <div className={'Root__title'} onClick={onClick}>
                {/* <div>{isOpen ? '▼' : '▶'}&nbsp;&nbsp;</div> */}
                <ArrowRightIcon className={`FileTree__arrowRight ${isOpen && 'FileTree__isActive'}`} />
                <div >{title}</div>
            </div>
            {
                isOpen && _include.map((v, i) => {
                    if (v.type === 'folder') {
                        return <Folder key={`${v.id}-${i}`} data={v} selectItem={selectItem} />
                    } else {
                        return <File key={`${v.id}-${i}`} data={v} selectItem={selectItem} />
                    }
                })
            }
        </div>

    )
}

export default Root