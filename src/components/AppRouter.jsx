import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';

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

// 博客列表和详情复用 BlogSPA
import BlogSPA from './BlogSPA.jsx';

// 动画包裹
function FadeTransition({ children }) {
  const location = useLocation();
  const [fade, setFade] = React.useState(false);
  React.useEffect(() => {
    setFade(true);
    const t = setTimeout(() => setFade(false), 200);
    return () => clearTimeout(t);
  }, [location.pathname]);
  return (
    <div className={fade ? 'fade fade-out' : 'fade fade-in'} style={{ minHeight: '60vh' }}>
      {children}
      <style>{`
        .fade { transition: opacity 0.3s; }
        .fade-in { opacity: 1; }
        .fade-out { opacity: 0; }
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
          <Route path="/blog/*" element={<BlogSPA />} />
        </Routes>
      </FadeTransition>
    </Router>
  );
} 