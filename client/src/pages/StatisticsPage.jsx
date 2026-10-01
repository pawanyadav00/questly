import React, { useEffect, useState, useMemo } from 'react';
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
  ResponsiveContainer,
} from 'recharts';
import { RiCheckDoubleFill, RiSwordFill, RiSparklingFill } from 'react-icons/ri';
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
    if (data) {
      setStats(data);
    }
  }, []);

  // Format data for charts; generate last 7 days baseline if empty
  const xpData = useMemo(() => {
    const entries = Object.entries(stats.dailyXp || {});
    if (entries.length > 0) {
      return entries.map(([date, xp]) => ({ date, xp }));
    }
    const baseline = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0].slice(5);
      baseline.push({ date: str, xp: 0 });
    }
    return baseline;
  }, [stats.dailyXp]);

  const questData = useMemo(() => {
    const entries = Object.entries(stats.dailyQuests || {});
    if (entries.length > 0) {
      return entries.map(([date, count]) => ({ date, quests: count }));
    }
    const baseline = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0].slice(5);
      baseline.push({ date: str, quests: 0 });
    }
    return baseline;
  }, [stats.dailyQuests]);

  const totalTrackedXp = useMemo(() => {
    return Object.values(stats.dailyXp || {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [stats.dailyXp]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Statistics & Analytics</h1>
        <p className={styles.subtitle}>Track your quest completion habits and experience trends</p>
      </header>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <RiCheckDoubleFill />
          </div>
          <div className={styles.summaryDetails}>
            <span className={styles.summaryLabel}>Total Quests Completed</span>
            <span className={styles.summaryVal}>{stats.totalQuestsCompleted ?? 0}</span>
            <span className={styles.summarySub}>Conquered challenges</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <RiSwordFill />
          </div>
          <div className={styles.summaryDetails}>
            <span className={styles.summaryLabel}>Bosses Defeated</span>
            <span className={styles.summaryVal}>{stats.totalBossDefeated ?? 0}</span>
            <span className={styles.summarySub}>Campaign bosses slain</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <RiSparklingFill />
          </div>
          <div className={styles.summaryDetails}>
            <span className={styles.summaryLabel}>Tracked Experience</span>
            <span className={styles.summaryVal}>{totalTrackedXp} XP</span>
            <span className={styles.summarySub}>From recorded sessions</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Experience Over Time</h2>
            <span className={styles.chartSubtitle}>Daily XP accrued</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                  }}
                />
                <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Quests Completed Per Day</h2>
            <span className={styles.chartSubtitle}>Daily activity volume</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                  }}
                />
                <Bar dataKey="quests" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

