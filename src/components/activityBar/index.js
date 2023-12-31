import react, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'
import { CodeIcon, ForumIcon, SoccerIcon, ToolsIcon } from '../../common/icon'
import { Tooltip } from 'reactstrap'

const ActivityBar = () => {
    const [isBlog, setIsBlog] = useState(false)
    const [isTools, setIsTools] = useState(false)
    const [isIde, setIsIde] = useState(false)
    const [isSetting, setIsSetting] = useState(false)

    // useEffect(() => {
    //     setIsOpen(true)
    // }, [])

    return (
        <div className='ActivityBar'>
            {/* Blog page */}
            <Link id='Link__Blog' to="Blog" >
                <ForumIcon className='ActivityBar__icon' />
            </Link>
            {/* Tools page */}
            <Link id='Link__Tools' to="Tools">
                <ToolsIcon className='ActivityBar__icon' />
            </Link>
            {/* IDE? page */}
            <Link id='Link__Ide' to="Ide">
                <CodeIcon className='ActivityBar__icon' />
            </Link>
            {/*  */}
            {/* <Link to="/">
                <div>4</div>
            </Link> */}
            {/* Testing Page */}
            {/* <Link to="/">
                <div>5</div>
            </Link> */}
            {/* Testing Page */}
            <Link id='Link__Setting' to="/" className='ActivityBar__setting'>
                <SoccerIcon className='ActivityBar__icon' />
            </Link>

            <Tooltip
                className={'ActivityBar__tooltip'}
                isOpen={isBlog}
                toggle={() => { setIsBlog(!isBlog) }}
                target={'Link__Blog'}
                placement='right'>Blog</Tooltip>
            <Tooltip
                className={'ActivityBar__tooltip'}
                isOpen={isTools}
                toggle={() => { setIsTools(!isTools) }}
                target={'Link__Tools'}
                placement='right'>Tools</Tooltip>
            <Tooltip
                className={'ActivityBar__tooltip'}
                isOpen={isIde}
                toggle={() => { setIsIde(!isIde) }}
                target={'Link__Ide'}
                placement='right'>Ide</Tooltip>
            <Tooltip
                className={'ActivityBar__tooltip'}
                isOpen={isSetting}
                toggle={() => { setIsSetting(!isSetting) }}
                target={'Link__Setting'}
                placement='right'>Setting</Tooltip>
        </div>
    )
}
export default ActivityBar