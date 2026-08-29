import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/ui.jsx';
import { Activity, CheckCircle, Clock, Percent, Users } from 'lucide-react';

export default function Judging() {
  const { state } = useAppData();

  const totalProjects = state.projects.length;
  const evaluatedProjects = state.projects.filter(p => p.status === 'evaluated').length;
  const pendingProjects = totalProjects - evaluatedProjects;
  const completionPct = totalProjects > 0 ? Math.round((evaluatedProjects / totalProjects) * 100) : 0;
  const activeJudges = state.users.filter(u => u.role === 'judge').length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Judging Progress</h1>
        <p className="text-slate-500 mt-1">Track evaluations across all submitted projects.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-indigo-600 text-white border-none shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Projects</p>
              <h3 className="text-2xl font-bold mt-1">{totalProjects}</h3>
            </div>
            <div className="p-3 bg-indigo-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-600 text-white border-none shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Evaluated</p>
              <h3 className="text-2xl font-bold mt-1">{evaluatedProjects}</h3>
            </div>
            <div className="p-3 bg-emerald-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-500 text-white border-none shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Pending</p>
              <h3 className="text-2xl font-bold mt-1">{pendingProjects}</h3>
            </div>
            <div className="p-3 bg-amber-400 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 text-white border-none shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm font-medium">Completion</p>
              <h3 className="text-2xl font-bold mt-1">{completionPct}%</h3>
            </div>
            <div className="p-3 bg-slate-700 rounded-lg">
              <Percent className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Project Status</h2>
          {state.projects.map(project => {
            const team = state.teams.find(t => t.id === project.teamId);
            const isEvaluated = project.status === 'evaluated';
            const totalScore = isEvaluated && project.scores 
              ? Object.values(project.scores).reduce((a, b) => a + b, 0) 
              : null;

            return (
              <Card key={project.id}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">Team: {team?.name}</p>
                    </div>
                    <Badge variant={isEvaluated ? 'success' : 'warning'}>
                      {isEvaluated ? 'Evaluated' : 'Pending'}
                    </Badge>
                  </div>
                  
                  {isEvaluated ? (
                    <div className="mt-4 flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                      <span className="font-medium text-sm text-indigo-900">Final Score</span>
                      <span className="text-xl font-bold text-indigo-600">{totalScore} <span className="text-xs text-indigo-400 font-normal">/ 100</span></span>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-amber-700 text-sm">
                      <Activity className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-medium">Evaluation is currently in progress.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Judge Activity</h2>
          <Card>
            <CardContent className="p-0 divide-y divide-slate-100">
              {state.users.filter(u => u.role === 'judge').map(judge => (
                <div key={judge.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                      {judge.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{judge.name}</p>
                      <p className="text-xs text-slate-500">
                        {judge.assignedProjects?.length || 0} Assigned
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" className="px-2 py-0.5 text-xs">Active</Badge>
                </div>
              ))}
              {activeJudges === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">No judges registered.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
