import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardContent, Button, Badge } from '../../components/ui.jsx';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { currentUser, state } = useAppData();
  
  const assignedProjects = state.projects.filter(p => currentUser.assignedProjects?.includes(p.id));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">My Assigned Projects</h1>
        <p className="text-slate-500 mt-1">Review and evaluate your assigned hackathon submissions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignedProjects.map(project => (
          <Card key={project.id} className="flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-1">{project.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-3">Team: {state.teams.find(t => t.id === project.teamId)?.name}</p>
                  {project.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{project.description}</p>
                  )}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Badge variant={project.status === 'evaluated' ? 'success' : 'warning'}>
                  {project.status === 'evaluated' ? 'Completed' : 'Pending'}
                </Badge>
              </div>

              {project.status === 'evaluated' && project.scores && (
                <div className="mt-4 mb-6 bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600">Total Score</span>
                    <span className="font-bold text-indigo-600 text-lg">
                      {Object.values(project.scores).reduce((a, b) => a + b, 0)} / 100
                    </span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(project.scores).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs text-slate-500">
                        <span className="capitalize">{key}</span>
                        <span>{value}/20</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6">
                <Link to={`/judge/evaluate/${project.id}`}>
                  <Button variant={project.status === 'evaluated' ? 'outline' : 'primary'} className="w-full">
                    {project.status === 'evaluated' ? 'Edit Evaluation' : 'Start Evaluation'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
