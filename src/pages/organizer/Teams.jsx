import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui.jsx';
import { Users, FileText } from 'lucide-react';

export default function Teams() {
  const { state } = useAppData();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Teams Overview</h1>
        <p className="text-slate-500 mt-1">Manage all participating teams and their project status.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.teams.map(team => {
          const members = state.users.filter(u => team.members.includes(u.id));
          const project = state.projects.find(p => p.teamId === team.id);
          
          return (
            <Card key={team.id} className="flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-900">{team.name}</h3>
                  <Badge variant={
                    team.projectStatus === 'Submitted' || team.projectStatus === 'Evaluating' ? 'success' : 'warning'
                  }>
                    {team.projectStatus}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Members ({members.length})</p>
                  <div className="flex -space-x-3">
                    {members.map(member => (
                      <div 
                        key={member.id} 
                        className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center font-bold text-sm text-indigo-700"
                        title={member.name}
                      >
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {members.length === 0 && (
                      <span className="text-sm text-slate-400 italic">No members yet</span>
                    )}
                  </div>
                </div>

                {project && (
                  <div className="mt-auto bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-sm text-slate-700 truncate">{project.name}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <Button variant="ghost" size="sm">View Details &rarr;</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
