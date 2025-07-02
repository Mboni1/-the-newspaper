import React from 'react';
import Article from '../components/Article';
import ArticleWithSidebar from '../components/ArticleWithSidebar';
import bgImage from '../assets/cover.png';

const HomePage = () => {
  return (
    <div>
      <section
        className="bg-cover bg-repeat bg-bottom w-full h-230"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-full h-screen flex items-end">
          <div className="container mx-auto mb-60 text-white px-10">
            <h1 className="text-6xl font-bold mb-18">
              Welcome to The Halftime
            </h1>
            <p className="text-lg max-w-2xl">
              We share the latest football and basketball news while helping young talents connect with top clubs worldwide. For fans and scouts, this is where future champions are born.
            </p>
          </div>
        </div>
      </section>

      <Article />
      <ArticleWithSidebar />
    </div>
  );
};

export default HomePage;
