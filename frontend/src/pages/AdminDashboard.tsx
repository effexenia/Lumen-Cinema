import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
      totalMovies: 0,
      totalSessions: 0,
      totalUsers: 0,
      totalTickets: 0
    });
  
    // useEffect(() => {
    //   const fetchStats = async () => {
    //     const data = await authService.getAdminStats();
    //     setStats(data);
    //   };
    //   fetchStats();
    // }, []);
  
    return (
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Movies</h3>
            <p>{stats.totalMovies}</p>
            <Link to="/admin/movies">Manage</Link>
          </div>
          
          <div className="stat-card">
            <h3>Sessions</h3>
            <p>{stats.totalSessions}</p>
            <Link to="/admin/sessions">Manage</Link>
          </div>
          
          <div className="stat-card">
            <h3>Users</h3>
            <p>{stats.totalUsers}</p>
            <Link to="/admin/users">Manage</Link>
          </div>
          
          <div className="stat-card">
            <h3>Tickets</h3>
            <p>{stats.totalTickets}</p>
            <Link to="/admin/tickets">View</Link>
          </div>
        </div>
        
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {/* Здесь можно отобразить последние действия */}
        </div>
      </div>
    );
  };