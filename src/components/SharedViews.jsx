import { useAppData } from '../context/AppDataContext.jsx';
import { Card, CardContent, Badge } from './ui.jsx';
import { Megaphone, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function AnnouncementsView() {
  const { state } = useAppData();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
        <p className="text-slate-500 mt-1">Latest updates from the organizers.</p>
      </header>

      <div className="space-y-4">
        {state.announcements.map(a => (
          <Card key={a.id} className={a.priority === 'high' ? 'border-indigo-200 shadow-indigo-100' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${a.priority === 'high' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{a.title}</h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm text-slate-500">{a.timestamp}</span>
                  {a.priority === 'high' && <Badge variant="primary">Important</Badge>}
                </div>
              </div>
              <p className="text-slate-600 ml-12">{a.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LeaderboardView() {
  const { state, currentUser } = useAppData();

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const dynamicLeaderboard = state.teams.map(team => {
    const project = state.projects.find(p => p.teamId === team.id);
    let totalScore = 0;
    let evals = 0;
    if (project && project.status === 'evaluated' && project.scores) {
      totalScore = Object.values(project.scores).reduce((a, b) => a + (Number(b) || 0), 0);
      evals = 1; // Assuming 1 evaluation per project for simplicity in this demo, or we can count based on schema
    }
    return {
      team: team.name,
      teamId: team.id,
      projectName: project ? project.name : 'No project',
      score: totalScore,
      evals,
      trend: totalScore > 50 ? 'up' : (totalScore === 0 ? 'same' : 'down')
    };
  }).sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Live Leaderboard</h1>
        <p className="text-slate-500 mt-1">Real-time team rankings based on evaluation scores.</p>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="Leaderboard Rankings">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Rank</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Trend</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Team</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Project</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Evaluations</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {dynamicLeaderboard.map((entry, index) => {
                const isMyTeam = entry.teamId === currentUser?.teamId;
                return (
                  <tr 
                    key={entry.team} 
                    className={`border-b border-slate-100 last:border-0 ${isMyTeam ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${entry.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                            entry.rank === 2 ? 'bg-slate-200 text-slate-700' :
                            entry.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}
                        `}>
                          {entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getTrendIcon(entry.trend)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{entry.team}</span>
                        {isMyTeam && <Badge variant="primary" className="ml-2">You</Badge>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">{entry.projectName}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {entry.evals}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-slate-900">{entry.score}</span>
                      <span className="text-slate-500 text-sm ml-1">/ 100</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
