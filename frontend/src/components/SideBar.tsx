import React from 'react';

export const Sidebar = ({ selectedTab, setSelectedTab }) => (
  <div
    style={{
      width: '220px',
      backgroundColor: '#1a1815', // чуть светлее чем #111110, с коричнево-серым подтоном
      color: '#d8cfc4', // мягкий светлый бежевый
      padding: '24px 16px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 8px rgba(0,0,0,0.7)',
    }}
  >
    <h2 style={{ color: '#f0e9df', fontSize: '20px', marginBottom: '32px' }}>
      🎥 Cinema Admin
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {[
        { label: '📊 Dashboard', key: 'dashboard' },
        { label: '👤 Users', key: 'users' },
        { label: '🎞️ Movies', key: 'movies' },
        { label: '🎬 Sessions', key: 'sessions' },
        { label: '💺 Halls', key: 'halls' },
        { label: '🎟️ Tickets', key: 'tickets' },
        { label: '💳 Payments', key: 'payments' },
      ].map((tab) => (
        <li
          key={tab.key}
          style={{
            padding: '10px 14px',
            backgroundColor: selectedTab === tab.key ? '#3e362f' : 'transparent', // более светлый коричневый при выборе
            color: selectedTab === tab.key ? '#f5f1e8' : '#b3a999', // светлый бежевый для активного, теплый серо-бежевый для остальных
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
