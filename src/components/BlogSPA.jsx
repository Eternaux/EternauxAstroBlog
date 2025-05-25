import React from 'react';

// 示例文章数据（实际可用 props 传入或 fetch 获取）
const posts = [
  {
    slug: 'demo-1',
    title: 'ChatGPT 国内注册及第三方客户端使用方法',
    description: '我自己 ChatGPT 注册的方式和使用的第三方客户端',
    cover: '/images/chatgpt-cover.png',
    content: `# ChatGPT 国内注册及第三方客户端使用方法\n\n详细介绍如何在国内注册 ChatGPT 账号，以及推荐几款好用的第三方客户端。`
  },
  {
    slug: 'demo-2',
    title: '被 Notion 收购的 Cron 有哪些值得学习的设计细节',
    description: '关于 Cron 的设计细节分享',
    cover: '/images/cron-cover.png',
    content: `# 被 Notion 收购的 Cron 有哪些值得学习的设计细节\n\n分享 Cron 日历应用中值得借鉴的设计细节。`
  },
  {
    slug: 'demo-3',
    title: '组件库设计与管理实践',
    description: '前端组件库的设计与管理经验总结',
    cover: '/images/components-cover.png',
    content: `# 组件库设计与管理实践\n\n总结前端组件库的设计与管理经验。`
  },
  {
    slug: 'demo-4',
    title: '前端开发中的代码规范与自动化',
    description: '如何通过自动化工具提升前端开发效率',
    cover: '/images/code-cover.png',
    content: `# 前端开发中的代码规范与自动化\n\n介绍前端开发中常用的代码规范和自动化工具。`
  }
];

function markdownToHtml(md) {
  // 简单的 markdown 转 html（可换成 marked/markdown-it 等库）
  return md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\n/g, '<br />');
}

export default function BlogSPA({ selected, onSelect, onBack }) {
  return (
    <div style={{ minHeight: '60vh', position: 'relative' }}>
      {!selected ? (
        <div className="posts-grid">
          {posts.map(post => (
            <div className="post-card" key={post.slug} onClick={() => onSelect(post.slug)} style={{ cursor: 'pointer' }}>
              <img src={post.cover} alt={post.title} />
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="post-detail">
          <button onClick={onBack} style={{ marginBottom: '1em' }}>← 返回</button>
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(posts.find(p => p.slug === selected).content) }} />
        </div>
      )}
      <style>{`
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .post-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .post-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
        }
        .post-card img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
        }
        .post-card h3 {
          margin: 1rem 1rem 0.5rem 1rem;
          font-size: 1.2rem;
        }
        .post-card p {
          margin: 0 1rem 1rem 1rem;
          color: #666;
          font-size: 1rem;
        }
        .post-detail {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        @media (max-width: 600px) {
          .post-detail {
            padding: 1em;
          }
        }
      `}</style>
    </div>
  );
} 