import React from 'react';

export const Sidebar = ({ selectedTab, setSelectedTab }) => (
  <div
    style={{
      width: '220px',
      backgroundColor: '#1e1e2f',
      color: 'white',
      padding: '24px 16px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 6px rgba(0,0,0,0.3)',
    }}
  >
    <h2 style={{ color: '#ffffff', fontSize: '20px', marginBottom: '32px' }}>
      🎥 Cinema Admin
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {[
        { label: '📊 Dashboard', key: 'dashboard' },
        { label: '👤 Users', key: 'users' },
        { label: '🎬 Sessions', key: 'sessions' },
        { label: '💺 Halls', key: 'halls' },
        { label: '🎟️ Tickets', key: 'tickets' },
        { label: '💳 Payments', key: 'payments' },
      ].map((tab) => (
        <li
          key={tab.key}
          style={{
            padding: '10px 14px',
            backgroundColor: selectedTab === tab.key ? '#2f2f45' : 'transparent',
            color: selectedTab === tab.key ? '#ffffff' : '#c5c5d2',
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
              selectedTab === tab.key ? '#2f2f45' : '#29293d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              selectedTab === tab.key ? '#2f2f45' : 'transparent';
          }}
        >
          {tab.label}
        </li>
      ))}
    </ul>
  </div>
);
