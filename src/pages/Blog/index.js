import { useState, useEffect } from 'react'
import Tree from '../../components/tree'
import Intro from '../../components/intro'
import MakeJson from '../../components/makeJson'
import './styles.scss'
import axios from 'axios'
import MarkdownIt from 'markdown-it'
import { CloseIcon, PostAddIcon } from '../../common/icon'

const empty = `
<div>ballboy의 Blog입니다.</div>
<div>내용을 정리중에 있습니다.</div>
<div>곧 업데이트 예정입니다.</div>
`

const posting = async (url) => {
    try {
        // const baseUrl = process.env.REACT_APP_GITHUB_URL
        // const repoBranch = 'jirareport_back/main/'
        // const file = 'ReadMe.md'
        // const { data } = await axios.get(`${baseUrl}${repoBranch}${file}`)

        // const regex = /\!\[([^\]]+)\]\(([^\)]+)\)/g
        // const post = data.split('\n').map((v) => {
        //     return (
        //         regex.test(v)
        //             ? v.replace(regex, `![$1](${baseUrl}${repoBranch}$2)`)
        //             : v
        //     )
        // })

        // const parse3 = MarkdownIt().render(post.join('\n'))

        // return parse3

        const baseUrl = process.env.REACT_APP_GITHUB_URL || 'https://raw.githubusercontent.com/BallboyDev/'
        const fileUrl = url
        const { data } = await axios.get(`${baseUrl}${fileUrl}`)

        const conversion = MarkdownIt().render(data)

        return conversion
    } catch (ex) { }
}

const Blog = () => {
    const [convert, setConvert] = useState('<></>')
    const [currentPost, setCurrentPost] = useState({})
    const [postList, setPostList] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const openList = localStorage.getItem('openList')
        if (!openList) {
            localStorage.setItem('openList', JSON.stringify([]))
            setPostList([])
        } else {
            const temp = JSON.parse(openList)

            if (temp.length > 0) {
                setPostList(temp)
                setCurrentPost(() => {
                    posting(temp[0]._data).then((res) => {
                        setConvert(res)
                    })
                    return temp[0]
                })
            }
        }
    }, [])

    const selectItem = async (item) => {
        const temp = postList.some((v) => { return v.id === item.id })
        if (!temp) {
            if (postList.length >= 5) {
                const [first, ...others] = postList
                localStorage.setItem('openList', JSON.stringify([...others, item]))
                setPostList([...others, item])
            } else {
                localStorage.setItem('openList', JSON.stringify([...postList, item]))
                setPostList([...postList, item])
            }
        }
        setCurrentPost(() => {
            posting(item._data).then((res) => {
                setConvert(res)
            })
            return item
        })
    }

    const closeItem = (item) => {
        const others = postList.filter((v) => { return v.id !== item.id })

        localStorage.setItem('openList', JSON.stringify(others))
        setPostList(others)
        if (currentPost.id === item.id) {
            setCurrentPost(() => {
                if (others.length > 0) {
                    posting(others[0]._data).then((res) => { setConvert(res) })
                }
                return others[0]
            })
        }
    }

    const supportBtn = [
        <PostAddIcon key={'PostAddIcon'} className={'Blog__nav__supportBtn'} onClick={() => {
            setIsOpen(true)
        }} />,
        // <PostAddIcon className={'Blog__nav__supportBtn'} onClick={() => { }} />,
        // <PostAddIcon className={'Blog__nav__supportBtn'} onClick={() => { }} />,
        // <PostAddIcon className={'Blog__nav__supportBtn'} onClick={() => { }} />
    ]

    return (
        <>
            <div className='Blog'>
                <div className='Blog__nav'>
                    <Tree selectItem={selectItem} supportBtn={supportBtn} />
                </div>
                <div className='Blog__content'>
                    {postList.length === 0 ? <Intro /> :
                        <>
                            <div className='Blog__content__titles'>
                                {
                                    postList.map((v, i) => <div
                                        key={`${v.id}-${i}`}
                                        className={`Blog__content__titles__title ${currentPost.id === v.id && 'Blog__active'}`} >
                                        <div className='Blog__content__titles__title__t' onClick={() => { selectItem(v) }}>{v.title}</div>
                                        <CloseIcon className='Blog__close' onClick={() => { closeItem(v) }} />
                                    </div>)
                                }
                            </div>
                            <div className='Blog__content__info'>

                                <div className='Blog__content__info__label'>
                                    <div className='Blog__content__info__label__key'>Created</div>
                                    <div className='Blog__content__info__label__value'>{currentPost._date.split('/')[0] || ''}</div>
                                </div>
                                <div className='Blog__content__info__label'>
                                    <div className='Blog__content__info__label__key'>Modified</div>
                                    <div className='Blog__content__info__label__value'>{currentPost._date.split('/')[1] || currentPost._date.split('/')[0]}</div>
                                </div>
                            </div>
                            <article className='markdown-body' dangerouslySetInnerHTML={{ __html: convert || empty }} />
                        </>
                    }
                </div>
            </div>
            {isOpen && <MakeJson onClose={() => { setIsOpen(false) }} />}

        </>
    )
}

export default Blog