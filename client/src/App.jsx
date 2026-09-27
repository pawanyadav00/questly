import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import QuestsPage from './pages/QuestsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import StatisticsPage from './pages/StatisticsPage';
import LevelUpModal from './components/common/LevelUpModal';

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Navbar />
          <LevelUpModal />
          <div style={{ paddingTop: '64px' }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/goals/:goalId" element={<GoalDetailPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/skills" element={<Navigate to="/quests" replace />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/stats" element={<StatisticsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
