import React, { useEffect, useState } from 'react';
import { getStats } from '../services/storage';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './statisticsPage.module.css';

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    dailyXp: {},
    dailyQuests: {},
    totalQuestsCompleted: 0,
    totalBossDefeated: 0,
  });

  useEffect(() => {
    const data = getStats();
    setStats(data);
  }, []);

  // Transform dailyXp into array of {date, xp}
  const xpData = Object.entries(stats.dailyXp).map(([date, xp]) => ({ date, xp }));
  // Transform dailyQuests into array of {date, quests}
  const questData = Object.entries(stats.dailyQuests).map(([date, count]) => ({ date, quests: count }));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Statistics</h1>

      <section className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>Experience Over Time</h2>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={xpData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id='colorXp' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey='date' />
            <YAxis />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip />
            <Area type='monotone' dataKey='xp' stroke='#8884d8' fillOpacity={1} fill='url(#colorXp)' />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>Quests Completed Per Day</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={questData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='quests' fill='#82ca9d' />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>Overall Summary</h2>
        <ul className={styles.summaryList}>
          <li>Total Quests Completed: {stats.totalQuestsCompleted}</li>
          <li>Total Bosses Defeated: {stats.totalBossDefeated}</li>
        </ul>
      </section>
    </div>
  );
};

export default StatisticsPage;
