import { useEffect } from 'react'
import newData from '../../_post/tempData/new.json'
import './styles.scss'
import Root from './root'
import File from './file'

const Tree = ({ selectItem, supportBtn }) => {

    const roots = newData.sort((a, b) => {
        return (
            a.type === 'file'
                ? (b.type === 'file' ? (a._index - b._index) : 1)
                : (b.type === 'file' ? -1 : (a.title > b.title ? 1 : -1))
        )
    })

    useEffect(() => {
        const openItem = localStorage.getItem('openItem')
        if (!openItem || openItem.trim() === '') {
            localStorage.setItem('openItem', '|')
        }

    }, [])

    return (
        <div className={'FileTree'}>
            <div className={'FileTree__buttonGroup'}>
                {
                    supportBtn.map((v, i) => {
                        return v
                    })
                }
            </div>
            <div className={'FileTree__itemList'}>
                {
                    roots.map((v, i) => {
                        if (v.type === 'folder' || v.type === 'root') {
                            return <Root key={`${v.id}-${i}`} data={v} selectItem={selectItem} />
                        } else {
                            return <File key={`${v.id}-${i}`} data={v} selectItem={selectItem} />
                        }

                    })
                }
            </div>
        </div>
    )
}

export default Tree;