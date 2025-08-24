import React from 'react';

export const Sidebar = ({ selectedTab, setSelectedTab }) => (
  <div
    style={{
      width: '220px',
      backgroundColor: '#1a1815',
      color: '#d8cfc4',
      padding: '24px 16px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 8px rgba(0,0,0,0.7)',
    }}
  >
    <h2 style={{ color: '#f0e9df', fontSize: '20px', marginBottom: '32px' }}>
      🎥 Панель адміністратора
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {[
        { label: '📊 Статистика', key: 'dashboard' },
        { label: '👤 Користувачі', key: 'users' },
        { label: '🎞️ Фільми', key: 'movies' },
        { label: '🎬 Сесії', key: 'sessions' },
        { label: '💺 Зали', key: 'halls' },
        { label: '🎟️ Квитки', key: 'tickets' },
        { label: '💳 Платежі', key: 'payments' },
      ].map((tab) => (
        <li
          key={tab.key}
          style={{
            padding: '10px 14px',
            backgroundColor: selectedTab === tab.key ? '#3e362f' : 'transparent', 
            color: selectedTab === tab.key ? '#f5f1e8' : '#b3a999', 
            cursor: 'pointer',
            borderRadius: '8px',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '15px',
            transition: 'background-color 0.2s, color 0.2s',
          }}
          onClick={() => setSelectedTab(tab.key)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              selectedTab === tab.key ? '#3e362f' : '#2e2a24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              selectedTab === tab.key ? '#3e362f' : 'transparent';
          }}
        >
          {tab.label}
        </li>
      ))}
    </ul>
  </div>
);
