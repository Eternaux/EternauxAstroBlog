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
function Home({ navigate: customNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 处理来自404页面的重定向
  useEffect(() => {
    // 检查URL参数是否包含重定向路径
    const params = new URLSearchParams(location.search);
    const redirectPath = params.get('spa_path');
    
    // 检查sessionStorage中是否有保存的路径
    const storedPath = sessionStorage.getItem('spa_path');
    
    if (redirectPath || storedPath) {
      const targetPath = redirectPath || storedPath;
      // 清除sessionStorage，避免循环
      sessionStorage.removeItem('spa_path');
      // 清除URL参数并导航到正确路径
      navigate(decodeURIComponent(targetPath), { replace: true });
    }
  }, [location, navigate]);
  
  const handleClick = () => {
    if (customNavigate) {
      customNavigate('/blog');
    } else {
      navigate('/blog');
    }
  };
  
  return (
    <div style={{ padding: '2em 0' }}>
      <h2>欢迎来到 Eternaux 博客</h2>
      <p>我会写关于我感兴趣方向的文章</p>
      <button onClick={handleClick}>进入博客</button>
    </div>
  );
}

function BlogList({ onSelect }) {
  return <BlogSPA selected={null} onSelect={onSelect} onBack={() => {}} />;
}

function BlogDetail({ slug, onBack }) {
  return <BlogSPA selected={slug} onSelect={() => {}} onBack={onBack} />;
}

function BlogPage({ customNavigate }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const handleSelect = (slug) => {
    if (customNavigate) {
      customNavigate(`/blog/${slug}`);
    } else {
      navigate(`/blog/${slug}`);
    }
  };
  const handleBack = () => {
    if (customNavigate) {
      customNavigate('/blog');
    } else {
      navigate('/blog');
    }
  };
  return slug ? (
    <BlogDetail slug={slug} onBack={handleBack} />
  ) : (
    <BlogList onSelect={handleSelect} />
  );
}

function AppContent() {
  // 简化后的过渡效果
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 处理从404页面重定向
  useEffect(() => {
    // 检查URL参数
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('spa_path');
    
    // 检查sessionStorage (从404.html设置的)
    const storedPath = sessionStorage.getItem('spa_path');
    
    // 如果有重定向路径
    if (redirectPath || storedPath) {
      const targetPath = redirectPath || storedPath;
      // 清除会话存储，避免循环
      sessionStorage.removeItem('spa_path');
      // 导航到正确路径
      navigate(decodeURIComponent(targetPath), { replace: true });
    }
    
    setIsInitialized(true);
  }, [navigate, location.search]);

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

  // 初始化时不显示内容，避免闪烁
  if (!isInitialized) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <style>{`
          .loading-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
            flex-direction: column;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
        .manual-fade-out {
          opacity: 0 !important;
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
