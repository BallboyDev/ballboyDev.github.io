import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import Tools from './pages/Tools'
import Ide from './pages/Ide'
import Blog from './pages/Blog'
import './styles.scss'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import ActivityBar from './components/activityBar';
import moment from 'moment'

const root = ReactDOM.createRoot(document.getElementById('root'));

const enterDate = moment(localStorage.getItem('enterDate'))
if (!enterDate || moment.duration(enterDate.diff(moment())).asDays() > 31) {
  localStorage.clear()
}

localStorage.setItem('enterDate', moment().format('YYYYMMDD'))

root.render(
  <div className={'BallboyDev'}>
    <HashRouter>
      {/* <BrowserRouter> */}
      <ActivityBar />
      <Routes>
        <Route path='/' element={<Blog />}> </Route>
        <Route path='Blog' element={<Blog />}> </Route>
        <Route path='Tools' element={<Tools />}> </Route>
        <Route path='Ide' element={<Ide />}> </Route>
      </Routes>
      {/* </BrowserRouter> */}
    </HashRouter>
  </div >

);
