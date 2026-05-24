import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { ProgressProvider } from './store/ProgressContext';
import Landing from './pages/Landing';
import DadiHome from './pages/dadi/DadiHome';
import ListenLearnPage from './pages/dadi/ListenLearnPage';
import QuizPage from './pages/dadi/QuizPage';
import SpeakItPage from './pages/dadi/SpeakItPage';
import GranddaughterHome from './pages/granddaughter/GranddaughterHome';
import MatchingGamePage from './pages/granddaughter/MatchingGamePage';
import SayItPage from './pages/granddaughter/SayItPage';
import RewardsPage from './pages/granddaughter/RewardsPage';

export default function App() {
  return (
    <AppProvider>
      <ProgressProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dadi" element={<DadiHome />} />
            <Route path="/dadi/listen" element={<ListenLearnPage />} />
            <Route path="/dadi/quiz" element={<QuizPage />} />
            <Route path="/dadi/speak" element={<SpeakItPage />} />
            <Route path="/child" element={<GranddaughterHome />} />
            <Route path="/child/match" element={<MatchingGamePage />} />
            <Route path="/child/say" element={<SayItPage />} />
            <Route path="/child/rewards" element={<RewardsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ProgressProvider>
    </AppProvider>
  );
}
