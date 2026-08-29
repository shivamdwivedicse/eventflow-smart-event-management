import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui.jsx';
import { QrCode, Users, Megaphone, Trophy, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, state } = useAppData();
  
  const team = currentUser.teamId 
    ? state.teams.find(t => t.id === currentUser.teamId)
    : null;

  const unreadAnnouncements = state.announcements.filter(a => !a.read).length;
  
  let myRank = null;
  if (team) {
    const dynamicLeaderboard = state.teams.map(t => {
      const project = state.projects.find(p => p.teamId === t.id);
      let totalScore = 0;
      if (project && project.status === 'evaluated' && project.scores) {
        totalScore = Object.values(project.scores).reduce((a, b) => a + (Number(b) || 0), 0);
      }
      return { teamId: t.id, score: totalScore };
    }).sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1 }));
    
    const lEntry = dynamicLeaderboard.find(l => l.teamId === team.id);
    if (lEntry) myRank = lEntry.rank;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {currentUser.name}!</h1>
        <p className="text-slate-500 mt-1 font-medium">Here's your status for {state.eventInfo.name}</p>
      </header>

      {/* Top Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <Link to="/participant/qr" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Check-in Status</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentUser.checkedIn ? 'Checked In' : 'Pending'}</h3>
            <div className={`mt-2 flex items-center text-xs font-medium ${currentUser.checkedIn ? 'text-emerald-600' : 'text-amber-600'}`}>
              {currentUser.checkedIn ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
              {currentUser.checkedIn ? 'Verified' : 'Awaiting check-in'}
            </div>
          </div>
        </Link>
        <Link to={team ? "/participant/team" : "/participant/team-match"} className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Current Team</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 truncate">{team ? team.name : 'None yet'}</h3>
            <div className={`mt-2 flex items-center text-xs font-medium ${team ? 'text-indigo-600' : 'text-slate-500'}`}>
              <Users className="w-3 h-3 mr-1" />
              {team ? `${team.members.length} members` : 'Find a team'}
            </div>
          </div>
        </Link>
        <Link to="/participant/announcements" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Updates</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{unreadAnnouncements}</h3>
            <div className={`mt-2 flex items-center text-xs font-medium ${unreadAnnouncements > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
              <Megaphone className="w-3 h-3 mr-1" />
              Unread announcements
            </div>
          </div>
        </Link>
        <Link to="/participant/leaderboard" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Leaderboard Rank</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{myRank ? `#${myRank}` : '-'}</h3>
            <div className="mt-2 flex items-center text-xs font-medium text-slate-500">
              <Trophy className="w-3 h-3 mr-1" />
              {myRank ? 'View standings' : 'Not ranked yet'}
            </div>
          </div>
        </Link>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 text-lg mb-6">Quick Actions</h4>
          <div className="space-y-4">
            <Link to="/participant/qr" className="block">
              <div className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer group">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <h5 className="font-semibold text-slate-900 group-hover:text-indigo-900">View My QR Pass</h5>
                  <p className="text-sm text-slate-500">Use this to check in at the venue</p>
                </div>
              </div>
            </Link>
            {!team ? (
              <Link to="/participant/team-match" className="block">
                <div className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer group">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h5 className="font-semibold text-slate-900 group-hover:text-indigo-900">Find a Team</h5>
                    <p className="text-sm text-slate-500">Match with other participants</p>
                  </div>
                </div>
              </Link>
            ) : (
              <Link to="/participant/team" className="block">
                <div className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer group">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h5 className="font-semibold text-slate-900 group-hover:text-indigo-900">View Team Hub</h5>
                    <p className="text-sm text-slate-500">Manage your project and members</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        <section className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-lg">Latest Announcements</h4>
            <Link to="/participant/announcements" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</Link>
          </div>
          <div className="space-y-5 flex-1">
            {state.announcements.slice(0, 3).map(a => (
              <div key={a.id} className={`flex gap-3 border-l-2 pl-3 py-1 ${a.priority === 'high' ? 'border-red-500' : 'border-indigo-500'}`}>
                <div>
                  <p className={`text-xs font-bold flex items-center gap-2 ${a.priority === 'high' ? 'text-red-400' : 'text-indigo-400'}`}>
                    {a.timestamp}
                    {a.priority === 'high' && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Important</span>}
                  </p>
                  <p className="text-sm font-medium mt-1 leading-snug text-slate-200">{a.title}</p>
                  <p className="text-sm mt-0.5 text-slate-400">{a.message}</p>
                </div>
              </div>
            ))}
            {state.announcements.length === 0 && (
              <p className="text-slate-400 text-sm italic">No announcements yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
