import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui.jsx';
import { Users, QrCode, FileText, CheckSquare, Activity, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { state } = useAppData();

  const totalParticipants = state.users.filter(u => u.role === 'participant').length;
  const checkedIn = state.users.filter(u => u.role === 'participant' && u.checkedIn).length;
  const teams = state.teams.length;
  const projects = state.projects.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <Link to="/organizer/checkins" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Registered Participants</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalParticipants}</h3>
            <div className="mt-2 flex items-center text-xs text-green-600 font-medium">
              <Activity className="w-3 h-3 mr-1" />
              Active
            </div>
          </div>
        </Link>
        <Link to="/organizer/checkins" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Checked In</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {checkedIn} <span className="text-slate-400 font-normal text-lg">({totalParticipants > 0 ? Math.round((checkedIn/totalParticipants)*100) : 0}%)</span>
            </h3>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full transition-all" style={{ width: `${totalParticipants > 0 ? (checkedIn/totalParticipants)*100 : 0}%` }}></div>
            </div>
          </div>
        </Link>
        <Link to="/organizer/teams" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Teams Formed</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{teams}</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Avg. {teams > 0 ? (checkedIn/teams).toFixed(1) : 0} members / team</p>
          </div>
        </Link>
        <Link to="/organizer/judging" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Projects Submitted</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{projects}</h3>
            <div className="mt-2 flex items-center gap-1">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">Submission Open</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800 text-lg">Live Judging Progress</h4>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><span className="w-2 h-2 bg-indigo-600 rounded-full"></span> Evaluated</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><span className="w-2 h-2 bg-slate-200 rounded-full"></span> Pending</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              {state.projects.map(project => {
                const isEvaluated = project.status === 'evaluated';
                const pct = isEvaluated ? 100 : 0;
                return (
                  <div key={project.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 truncate">{project.name}</span>
                      <span className="text-slate-900">{pct}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-50 rounded border border-slate-100 flex overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-slate-100 pt-6 flex flex-wrap justify-around gap-4 mt-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{state.users.filter(u => u.role === 'judge').length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Active Judges</p>
              </div>
              <div className="text-center md:border-l md:border-slate-100 md:pl-8">
                <p className="text-2xl font-bold text-slate-900">
                  {state.projects.filter(p => p.status === 'evaluated').length} / {projects}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Evaluations Done</p>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg">Live Announcements</h4>
              <Link to="/organizer/announcements" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</Link>
            </div>
            <div className="space-y-5 flex-1">
              {state.announcements.slice(0,3).map(a => (
                <div key={a.id} className={`flex gap-3 border-l-2 pl-3 py-1 ${a.priority === 'high' ? 'border-red-500' : 'border-indigo-500'}`}>
                  <div>
                    <p className={`text-xs font-bold ${a.priority === 'high' ? 'text-red-400' : 'text-indigo-400'}`}>{a.timestamp}</p>
                    <p className="text-sm font-medium mt-1 leading-snug text-slate-200">{a.title} - {a.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/organizer/announcements">
              <button className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors shadow-sm">
                Broadcast New
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 shrink-0">
            <h4 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">Recent Activity</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">PR</div>
                  <span className="text-sm font-semibold text-slate-700">Project Evaluated</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Just now</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">CH</div>
                  <span className="text-sm font-semibold text-slate-700">Check-in: Alex</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">5m ago</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
