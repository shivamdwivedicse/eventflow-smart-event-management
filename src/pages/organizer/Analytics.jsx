import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui.jsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

export default function Analytics() {
  const { state } = useAppData();

  const totalParticipants = state.users.filter(u => u.role === 'participant').length;
  const checkedIn = state.users.filter(u => u.role === 'participant' && u.checkedIn).length;
  const notCheckedIn = totalParticipants - checkedIn;

  const totalTeams = state.teams.length;
  const teamsWithProjects = state.projects.length;
  const teamsWithoutProjects = totalTeams - teamsWithProjects;

  const evaluatedProjects = state.projects.filter(p => p.status === 'evaluated').length;
  const pendingProjects = teamsWithProjects - evaluatedProjects;

  const checkinData = [
    { name: 'Checked In', value: checkedIn },
    { name: 'Pending', value: notCheckedIn }
  ];

  const projectStatusData = [
    { name: 'Evaluated', value: evaluatedProjects },
    { name: 'Pending Eval', value: pendingProjects }
  ];

  const COLORS = ['#10b981', '#f1f5f9'];
  const STATUS_COLORS = ['#4f46e5', '#f59e0b'];

  // Calculate Average Scores
  const evaluated = state.projects.filter(p => p.status === 'evaluated' && p.scores);
  let categoryScores = [
    { category: 'Innovation', avg: 0, max: 20 },
    { category: 'Technical', avg: 0, max: 20 },
    { category: 'Impact', avg: 0, max: 20 },
    { category: 'UI/UX', avg: 0, max: 20 },
    { category: 'Presentation', avg: 0, max: 20 },
  ];

  if (evaluated.length > 0) {
    let sums = { Innovation: 0, Technical: 0, Impact: 0, 'UI/UX': 0, Presentation: 0 };
    evaluated.forEach(p => {
      sums.Innovation += Number(p.scores.innovation) || 0;
      sums.Technical += Number(p.scores.technical) || 0;
      sums.Impact += Number(p.scores.impact) || 0;
      sums['UI/UX'] += Number(p.scores.uiux) || 0;
      sums.Presentation += Number(p.scores.presentation) || 0;
    });
    
    categoryScores = categoryScores.map(cat => ({
      ...cat,
      avg: Number((sums[cat.category] / evaluated.length).toFixed(1))
    }));
  }

  // Realistic timeline mock
  const timelineData = [
    { time: 'Day 1 - 9 AM', checkins: Math.floor(checkedIn * 0.1), submissions: 0, evaluations: 0 },
    { time: 'Day 1 - 2 PM', checkins: Math.floor(checkedIn * 0.6), submissions: 0, evaluations: 0 },
    { time: 'Day 1 - 8 PM', checkins: Math.floor(checkedIn * 0.9), submissions: 0, evaluations: 0 },
    { time: 'Day 2 - 9 AM', checkins: checkedIn, submissions: Math.floor(teamsWithProjects * 0.1), evaluations: 0 },
    { time: 'Day 2 - 4 PM', checkins: checkedIn, submissions: teamsWithProjects, evaluations: Math.floor(evaluatedProjects * 0.3) },
    { time: 'Now', checkins: checkedIn, submissions: teamsWithProjects, evaluations: evaluatedProjects },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
        <p className="text-slate-500 mt-1">Event progress data and statistics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Event Progression Timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-80" role="img" aria-label="Line chart showing event progression over time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="checkins" name="Check-ins" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="submissions" name="Submissions" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="evaluations" name="Evaluations" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Check-ins Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Participant Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-center" role="img" aria-label="Pie chart showing participant check-in status">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={checkinData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {checkinData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Judging Progress Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Judging Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-center" role="img" aria-label="Pie chart showing project judging progress">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average Category Scores Bar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Average Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80" role="img" aria-label="Bar chart showing average scores across judging criteria">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryScores} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis domain={[0, 20]} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="avg" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
