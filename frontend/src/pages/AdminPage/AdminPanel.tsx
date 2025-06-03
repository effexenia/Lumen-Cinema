import React, { useState } from 'react';
import { Sidebar } from '../../components/SideBar.tsx';
import { Dashboard } from './Dashboard.tsx';
import { Users } from './Users.tsx';
import { Sessions } from './Sessions.tsx';
import { Halls } from './Halls.tsx';
import { Tickets } from './Tickets.tsx';
import { Payments } from './Payments.tsx';
import { Movies } from './Movies.tsx';

export const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const renderTab = () => {
    switch (selectedTab) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <Users />;
      case 'movies': return <Movies />;
      case 'sessions': return <Sessions />;
      case 'halls': return <Halls />;
      case 'tickets': return <Tickets />;
      case 'payments': return <Payments />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div style={{ flex: 1, padding: '20px' }}>{renderTab()}</div>
    </div>
  );
};
