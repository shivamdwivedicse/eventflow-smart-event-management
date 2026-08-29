import { useState } from 'react';
import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui.jsx';
import { Users, FileEdit, CheckCircle, Github, Globe, Check, X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Team() {
  const { currentUser, state, acceptTeamRequest, rejectTeamRequest, createProject } = useAppData();
  
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  
  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    createProject({ name: projectName, description: projectDesc });
    setIsCreatingProject(false);
  };
  
  const team = currentUser.teamId 
    ? state.teams.find(t => t.id === currentUser.teamId)
    : null;

  const pendingReceived = state.teamRequests?.filter(r => r.toUserId === currentUser?.id && r.status === 'pending') || [];
  const pendingSent = state.teamRequests?.filter(r => r.fromUserId === currentUser?.id && r.status === 'pending') || [];

  const renderRequests = () => {
    if (pendingReceived.length === 0 && pendingSent.length === 0) return null;

    return (
      <div className="space-y-4 mb-6">
        {pendingReceived.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Invitations Received</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {pendingReceived.map(req => {
                const sender = state.users.find(u => u.id === req.fromUserId);
                return (
                  <div key={req.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="mb-3 sm:mb-0">
                      <p className="font-semibold text-slate-900">{sender?.name} wants to team up</p>
                      <p className="text-sm text-slate-500">{sender?.preferredRole || 'Participant'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => rejectTeamRequest(req.id)}>
                        <X className="w-4 h-4 mr-1" /> Decline
                      </Button>
                      <Button size="sm" onClick={() => acceptTeamRequest(req.id)}>
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}
        
        {pendingSent.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Requests Sent</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {pendingSent.map(req => {
                const receiver = state.users.find(u => u.id === req.toUserId);
                return (
                  <div key={req.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">Waiting for {receiver?.name}</span>
                    </div>
                    <Badge variant="default">Pending</Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (!team) {
    return (
      <div className="max-w-3xl mx-auto mt-8 space-y-6">
        {renderRequests()}
        <Card className="text-center p-12">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">You don't have a team yet</h2>
          <p className="text-slate-500 mb-6">Find teammates or wait for an invitation to get started.</p>
          <Link to="/participant/team-match">
            <Button>Find Teammates</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const members = state.users.filter(u => team.members.includes(u.id));
  const project = state.projects.find(p => p.teamId === team.id);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team: {team.name}</h1>
          <p className="text-slate-500 mt-1">Manage your team and project submission.</p>
        </div>
        <Badge variant={team.projectStatus === 'Submitted' ? 'success' : 'primary'} className="text-sm px-3 py-1">
          {team.projectStatus}
        </Badge>
      </header>
      
      {renderRequests()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{member.name} {member.id === currentUser.id && "(You)"}</h4>
                        <p className="text-sm text-slate-500 capitalize">{member.preferredRole || 'General'}</p>
                      </div>
                    </div>
                    {member.skills && (
                      <div className="hidden md:flex gap-2 flex-wrap justify-end max-w-[200px]">
                        {member.skills.map(s => <Badge key={s}>{s}</Badge>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Submission</CardTitle>
            </CardHeader>
            <CardContent>
              {project ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-slate-500 mt-1">Your project has been successfully linked to your team profile.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline"><Github className="w-4 h-4 mr-2" /> Repository</Button>
                    <Button variant="outline"><Globe className="w-4 h-4 mr-2" /> Live Demo</Button>
                  </div>
                </div>
              ) : isCreatingProject ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      placeholder="e.g. HealthTracker AI"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                      rows="3"
                      value={projectDesc}
                      onChange={e => setProjectDesc(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      placeholder="What does it do?"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsCreatingProject(false)}>Cancel</Button>
                    <Button onClick={handleCreateProject}>Submit Project</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-1">Ready to submit?</h3>
                  <p className="text-slate-500 mb-6">Create your project profile so judges can evaluate it.</p>
                  <Button onClick={() => setIsCreatingProject(true)}><FileEdit className="w-4 h-4 mr-2" /> Create Project</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Team Formed</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Topic Selected</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                  <span>Submit Code Repository</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                  <span>Live Demo Ready</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
