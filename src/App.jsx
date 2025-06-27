
import './App.css'
import Article from './components/Article'
import Header from './components/Header'
import ArticleWithSidebar from './components/ArticleWithSidebar'
import Footer from './components/Footer'
import FeedbackForm from './components/FeedbackForm'

function App() {

  return (
    <>
   <Header />
   <Article/>
   <div className="min-h-screen bg-gray-50">

      <ArticleWithSidebar />
    </div>
    <Footer/>
    </>
  )
}

export default App
