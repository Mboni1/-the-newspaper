import React from 'react';
import Header from '@components/Header';
import Article from '@components/Article';
import Footer from '../Components/Footer';
import ArticleWithSidebar from '../Components/ArticleWithSidebar';

const HomePage = () => {
  return (<div> 
    <Article/>
    <ArticleWithSidebar/>
  </div>);
};

export default HomePage;