import { useState, useContext, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider, PlayerContext } from './context/PlayerContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileBottomNav from './components/layout/MobileBottomNav';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import QuestsPage from './pages/QuestsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import StatisticsPage from './pages/StatisticsPage';
import LevelUpModal from './components/common/LevelUpModal';
import AISyllabusModal from './components/goals/AISyllabusModal';
import RollQuestModal from './components/quests/RollQuestModal';

function AppLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const {
    isAiModalOpen,
    setIsAiModalOpen,
    isRollModalOpen,
    setIsRollModalOpen,
    goals,
    addGoal,
    completeQuest
  } = useContext(PlayerContext);

  const allQuests = useMemo(() => {
    const list = [];
    (goals || []).forEach((goal) => {
      (goal.quests || []).forEach((q) => {
        list.push({
          ...q,
          goalId: goal.id,
          goalTitle: goal.title
        });
      });
    });
    return list;
  }, [goals]);

  const handleCompleteFromRoll = (goalId, questId) => {
    const targetQuest = allQuests.find((q) => q.id === questId);
    if (!targetQuest) return;
    completeQuest(questId, targetQuest.xpReward, targetQuest.coinReward, targetQuest.skillId, goalId);
  };

  return (
    <div className="app-layout">
      {/* Matte Black Left Sidebar (Collapsible Drawer on Mobile) */}
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Viewport */}
      <div className="app-main">
        {/* Top Header with Hamburger & Controls */}
        <Header onOpenMobileMenu={() => setIsMobileNavOpen(true)} />

        {/* Content Container */}
        <main className="app-content">
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
        </main>
      </div>

      {/* Phone Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Modals */}
      <LevelUpModal />
      <AISyllabusModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onCampaignDeployed={(newGoal) => addGoal(newGoal)}
      />
      <RollQuestModal
        isOpen={isRollModalOpen}
        onClose={() => setIsRollModalOpen(false)}
        quests={allQuests}
        onCompleteQuest={handleCompleteFromRoll}
        onNavigateToGoal={(goalId) => {
          setIsRollModalOpen(false);
          window.location.href = `/goals/${goalId}`;
        }}
      />
    </div>
  );
}

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
