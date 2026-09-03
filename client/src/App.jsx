import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import QuestsPage from './pages/QuestsPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/goals/:goalId" element={<GoalDetailPage />} />
            <Route path="/quests" element={<QuestsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
