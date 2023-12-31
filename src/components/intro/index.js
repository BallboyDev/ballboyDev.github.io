import './styles.scss'
import profile from '../../common/image/profile.jpg'

const Intro = () => {
    return (
        <div className='Intro'>
            {/* <div > */}
            {/* 이미지 */}
            {/* <div className='Intro__image'></div> */}
            <img className='Intro__image' src={profile} />
            {/* 인사말 */}
            <div className='Intro__'>- 게으른 개발자가 훌륭한 개발자다 - </div>
            <div className='Intro__about'>게을러 지기 위해 부지런히 움직이는 심심한 개발자 ballboy 입니다.</div>
            {/* 이메일 */}
            <div className='Intro__'>yswgood0329@gmail.com</div>
            {/* 깃허브 */}
            <div className='Intro__'>https://github.com/ballboyDev</div>
            {/* 기술스택 */}
            {/* <div className='Intro__'>기술스택</div> */}
            {/* </div> */}

        </div>
    )
}

export default Intro