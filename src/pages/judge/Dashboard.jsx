import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui.jsx';
import { CheckSquare, Clock, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, state } = useAppData();
  
  const assignedProjects = state.projects.filter(p => currentUser.assignedProjects?.includes(p.id));
  const evaluated = assignedProjects.filter(p => p.status === 'evaluated').length;
  const pending = assignedProjects.length - evaluated;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Judge Portal</h1>
        <p className="text-slate-500 mt-1 font-medium">Manage your project evaluations for {state.eventInfo.name}</p>
      </header>

      {/* Top Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <Link to="/judge/projects" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-indigo-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Assigned Projects</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{assignedProjects.length}</h3>
            <div className="mt-2 flex items-center text-xs font-medium text-indigo-600">
              <FileText className="w-3 h-3 mr-1" />
              Total in your queue
            </div>
          </div>
        </Link>
        <Link to="/judge/projects" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-amber-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Pending</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{pending}</h3>
            <div className="mt-2 flex items-center text-xs font-medium text-amber-600">
              <Clock className="w-3 h-3 mr-1" />
              Awaiting review
            </div>
          </div>
        </Link>
        <Link to="/judge/projects" className="block transition-transform hover:-translate-y-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full hover:border-emerald-200 transition-colors">
            <p className="text-slate-500 text-sm font-medium">Completed</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{evaluated}</h3>
            <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
              <CheckSquare className="w-3 h-3 mr-1" />
              Evaluations submitted
            </div>
          </div>
        </Link>
      </section>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-row items-center justify-between mb-6">
          <h4 className="font-bold text-slate-800 text-lg">Up Next for Evaluation</h4>
          <Link to="/judge/projects" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {assignedProjects.filter(p => p.status !== 'evaluated').map(project => (
            <div key={project.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
              <div className="mb-4 sm:mb-0">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-900">{project.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-slate-500">Team: {state.teams.find(t => t.id === project.teamId)?.name}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase">Pending</span>
                </div>
              </div>
              <Link to={`/judge/evaluate/${project.id}`}>
                <Button>Evaluate Project</Button>
              </Link>
            </div>
          ))}
          {pending === 0 && (
            <div className="text-center py-12 text-slate-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
              <p className="font-medium text-slate-900">All caught up!</p>
              <p className="text-sm">You have evaluated all assigned projects.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
