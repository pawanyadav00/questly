import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
// We will import pages here as we build them

// Temporary placeholders for pages
const DashboardPage = () => <div className="container" style={{padding: '2rem'}}><h1>Dashboard</h1></div>;
const GoalsPage = () => <div className="container" style={{padding: '2rem'}}><h1>Goals</h1></div>;
const QuestsPage = () => <div className="container" style={{padding: '2rem'}}><h1>Quests</h1></div>;

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ paddingTop: '64px' }}> {/* Space for fixed navbar */}
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/quests" element={<QuestsPage />} />
            {/* Add more routes here in future phases */}
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
