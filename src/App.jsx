import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext.jsx';
import Login from './pages/Login.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Participant Pages
import ParticipantDashboard from './pages/participant/Dashboard.jsx';
import QRPass from './pages/participant/QRPass.jsx';
import TeamMatch from './pages/participant/TeamMatch.jsx';
import ParticipantTeam from './pages/participant/Team.jsx';
import ParticipantAnnouncements from './pages/participant/Announcements.jsx';
import ParticipantLeaderboard from './pages/participant/Leaderboard.jsx';

// Judge Pages
import JudgeDashboard from './pages/judge/Dashboard.jsx';
import JudgeProjects from './pages/judge/Projects.jsx';
import JudgeEvaluate from './pages/judge/Evaluate.jsx';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/Dashboard.jsx';
import OrganizerCheckins from './pages/organizer/Checkins.jsx';
import OrganizerAnnouncements from './pages/organizer/Announcements.jsx';
import OrganizerTeams from './pages/organizer/Teams.jsx';
import OrganizerJudging from './pages/organizer/Judging.jsx';
import OrganizerLeaderboard from './pages/organizer/Leaderboard.jsx';
import OrganizerAnalytics from './pages/organizer/Analytics.jsx';

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/participant" element={<DashboardLayout role="participant" />}>
            <Route index element={<ParticipantDashboard />} />
            <Route path="qr" element={<QRPass />} />
            <Route path="team-match" element={<TeamMatch />} />
            <Route path="team" element={<ParticipantTeam />} />
            <Route path="announcements" element={<ParticipantAnnouncements />} />
            <Route path="leaderboard" element={<ParticipantLeaderboard />} />
          </Route>

          <Route path="/judge" element={<DashboardLayout role="judge" />}>
            <Route index element={<JudgeDashboard />} />
            <Route path="projects" element={<JudgeProjects />} />
            <Route path="evaluate/:projectId" element={<JudgeEvaluate />} />
          </Route>

          <Route path="/organizer" element={<DashboardLayout role="organizer" />}>
            <Route index element={<OrganizerDashboard />} />
            <Route path="checkins" element={<OrganizerCheckins />} />
            <Route path="announcements" element={<OrganizerAnnouncements />} />
            <Route path="teams" element={<OrganizerTeams />} />
            <Route path="judging" element={<OrganizerJudging />} />
            <Route path="leaderboard" element={<OrganizerLeaderboard />} />
            <Route path="analytics" element={<OrganizerAnalytics />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}
