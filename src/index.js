import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import Default from './pages/Default'
import Ide from './pages/Ide'
import Blog from './pages/Blog'
import './styles.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ActivityBar from './components/activityBar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className={'BallboyWeb'}>
    {/* <ActivityBar />
    <Blog /> */}
    <BrowserRouter>
      <ActivityBar />
      <Routes>
        <Route path='/' element={<Default />}> </Route>
        <Route path='/temp/1' element={<Blog />}> </Route>
        <Route path='/temp/2' element={<Default />}> </Route>
        <Route path='/temp/3' element={<Ide />}> </Route>
      </Routes>
    </BrowserRouter>
  </div >

);
