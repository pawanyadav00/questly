import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/layout/Navbar';
import SkillTreePage from './components/skills/SkillTreePage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import QuestsPage from './pages/QuestsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import StatisticsPage from './pages/StatisticsPage';
import DailyChallengePage from './pages/DailyChallengePage';

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Navbar />
          <div style={{ paddingTop: '64px' }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/goals/:goalId" element={<GoalDetailPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/skills" element={<SkillTreePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/stats" element={<StatisticsPage />} />
              <Route path="/daily" element={<DailyChallengePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
