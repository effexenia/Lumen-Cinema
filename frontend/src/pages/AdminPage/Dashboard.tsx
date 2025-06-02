import React, { useEffect, useState } from 'react';
import { getStatistics } from '../../api/adminService.ts';
import styles from './AdminPanel.module.css';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

interface UserByDay {
  date: string;
  count: number;
}

interface TicketsByDay {
  date: string;
  count: number;
}

interface RevenueByMonth {
  month: string;
  total: number;
}

interface TicketsByGenre {
  genre: string;
  count: number;
}

interface Statistics {
  userCount: number;
  ticketCount: number;
  revenue: number;
  usersByDay: UserByDay[];
  ticketsByDay: TicketsByDay[];
  revenueByMonth: RevenueByMonth[];
  ticketsByGenre: TicketsByGenre[];
  avgTicketPrice: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#9933FF', '#33AA99'];

export const Dashboard = () => {
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    getStatistics().then(setStats);
  }, []);

  if (!stats) return <p className={styles.container}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Dashboard</h2>

      <div>
        <p><b>Total Users:</b> {stats.userCount}</p>
        <p><b>Total Tickets:</b> {stats.ticketCount}</p>
        <p><b>Total Revenue:</b> {stats.revenue ? stats.revenue.toFixed(2) : '0.00'} ₴</p>
        <p><b>Average Ticket Price:</b> {stats.avgTicketPrice ? stats.avgTicketPrice.toFixed(2) : '0.00'} ₴</p>
      </div>

      <h3>Active Users by Day (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={stats.usersByDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Tickets Sold by Day (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={stats.ticketsByDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Revenue by Month (Last Year)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={stats.revenueByMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Tickets Distribution by Genre</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={stats.ticketsByGenre}
            dataKey="count"
            nameKey="genre"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {stats.ticketsByGenre.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
