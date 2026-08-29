import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext.jsx';
import { 
  LayoutDashboard, QrCode, Users, Megaphone, Trophy, 
  CheckSquare, FileEdit, UserCheck, PieChart, LogOut, Code, Activity, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = {
  participant: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/participant' },
    { label: 'My QR Pass', icon: QrCode, path: '/participant/qr' },
    { label: 'Team Match', icon: Users, path: '/participant/team-match' },
    { label: 'My Team', icon: Code, path: '/participant/team' },
    { label: 'Announcements', icon: Megaphone, path: '/participant/announcements' },
    { label: 'Leaderboard', icon: Trophy, path: '/participant/leaderboard' },
  ],
  judge: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/judge' },
    { label: 'Projects', icon: CheckSquare, path: '/judge/projects' },
  ],
  organizer: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/organizer' },
    { label: 'Live Check-ins', icon: UserCheck, path: '/organizer/checkins' },
    { label: 'Announcements', icon: Megaphone, path: '/organizer/announcements' },
    { label: 'Teams', icon: Users, path: '/organizer/teams' },
    { label: 'Judging Progress', icon: Activity, path: '/organizer/judging' },
    { label: 'Leaderboard', icon: Trophy, path: '/organizer/leaderboard' },
    { label: 'Analytics', icon: PieChart, path: '/organizer/analytics' },
  ]
};

export default function DashboardLayout({ role }) {
  const { currentUser, logout, state } = useAppData();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser || currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  const items = NAV_ITEMS[role];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">EventFlow</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-md"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex md:flex-col h-full
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex items-center gap-3 p-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <h1 className="font-bold text-xl tracking-tight text-slate-800">EventFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'}
                `}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Role</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 capitalize">{currentUser.role}</span>
              <button onClick={logout} className="text-indigo-600 text-xs font-medium hover:underline">
                Switch
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-8 hidden md:flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Event:</span>
            <span className="text-sm font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-800 border border-slate-200">
              {state.eventInfo.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Live
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-indigo-700 font-bold">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
