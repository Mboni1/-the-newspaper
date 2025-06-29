import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import React from 'react';
import Header from './Components/Header';
import Home from './Pages/Home';
import Footer from './Components/Footer'
import  Football  from './Pages/Football';
import  Basketball  from './Pages/Basketball';
import  Talents  from './Pages/Talents';
import  Contact  from './Pages/Contact';
import ArticleWithSidebar from './Components/ArticleWithSidebar';
import Article from './Components/Article';

const App = () =>{
  return (
    <BrowserRouter>
    <Header/>
    <Article/>
    <ArticleWithSidebar/>
    <Routes>
    <Route path="/Home" element= {<Home />}></Route>
    <Route path="/Football" element= {<Football />}></Route>
    <Route path="/Basketball" element= {<Basketball />}></Route>
    <Route path="/Talents" element= {<Talents />}></Route>
    <Route path="/Contact" element= {<Contact />}></Route>
    </Routes>
    <Footer/>
    </BrowserRouter>
  );
};



export default App;