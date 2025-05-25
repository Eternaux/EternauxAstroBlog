import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import BlogSPA from './BlogSPA.jsx';

// 首页组件
function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 处理来自404页面的重定向
  useEffect(() => {
    // 检查URL参数是否包含重定向路径
    const params = new URLSearchParams(location.search);
    const redirectPath = params.get('path');
    
    if (redirectPath) {
      // 清除URL参数并导航到正确路径
      navigate(redirectPath, { replace: true });
    }
  }, [location, navigate]);
  
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

function AppContent() {
  // 简化后的过渡效果
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 自定义导航函数以实现过渡效果
  const customNavigate = useCallback((to) => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(to);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  }, [navigate]);

  // 拦截所有链接点击
  useEffect(() => {
    const handleClick = (event) => {
      // 仅处理链接点击
      const link = event.target.closest('a');
      if (link && link.href.startsWith(window.location.origin)) {
        event.preventDefault();
        const path = link.href.replace(window.location.origin, '');
        if (path !== location.pathname) {
          customNavigate(path);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [customNavigate, location]);

  // 优化：页面加载时的过渡效果
  useEffect(() => {
    // 短暂延迟后显示内容，确保CSS已加载
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <Routes>
        <Route path="/" element={<Home navigate={customNavigate} />} />
        <Route path="/blog" element={<BlogPage customNavigate={customNavigate} />} />
        <Route path="/blog/:slug" element={<BlogPage customNavigate={customNavigate} />} />
        <Route path="*" element={<Home navigate={customNavigate} />} />
      </Routes>
      <style>{`
        .page-container {
          min-height: 60vh;
          transition: opacity 0.3s ease-in-out;
        }
        .fade-in {
          opacity: 1;
        }
        .fade-out {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
