import React from 'react';
import Header from '@components/Header';
import Article from '@components/Article';
import Footer from '../Components/Footer';
import ArticleWithSidebar from '../Components/ArticleWithSidebar';

const HomePage = () => {
  return (<div> 
  <h1 className="text-2xl leading-relaxed max-w-6xl mx-auto p-8 text-center text-gray-900">
   Welcome to The Halftime</h1>
  < div className= "text-xl leading-relaxed max-w-4xl mx-auto p-4 text-center text-gray-700">We share the latest football and basketball news 
   while helping young talents connect with top clubs worldwide.
   For fans and scouts, this is where future champions are born.
</div>
    <Article/>
    <ArticleWithSidebar/>
  </div>);
};

export default HomePage;