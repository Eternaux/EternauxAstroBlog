import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import BlogSPA from './BlogSPA.jsx';

// 首页组件
function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '2em 0' }}>
      <h2>欢迎来到 Eternaux 博客</h2>
      <p>我会写关于我感兴趣方向的文章</p>
      <button onClick={() => navigate('/blog')}>进入博客</button>
    </div>
  );
}

function BlogList({ onSelect }) {
  return <BlogSPA selected={null} onSelect={onSelect} onBack={() => {}} />;
}

function BlogDetail({ slug, onBack }) {
  return <BlogSPA selected={slug} onSelect={() => {}} onBack={onBack} />;
}

function BlogPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const handleSelect = (slug) => navigate(`/blog/${slug}`);
  const handleBack = () => navigate('/blog');
  return slug ? (
    <BlogDetail slug={slug} onBack={handleBack} />
  ) : (
    <BlogList onSelect={handleSelect} />
  );
}

// 动画包裹
function FadeTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  
  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
      
      // Wait until animation completes before updating the location
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 300); // Match this to your CSS transition time
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);
  
  return (
    <div className={`fade ${transitionStage}`} style={{ minHeight: '60vh' }}>
      {children}
      <style>{`
        .fade {
          transition: opacity 0.3s ease-in-out;
        }
        .fadeIn {
          opacity: 1;
        }
        .fadeOut {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <FadeTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
        </Routes>
      </FadeTransition>
    </Router>
  );
}
