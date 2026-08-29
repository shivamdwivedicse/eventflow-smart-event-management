import { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, Button, Badge } from '../../components/ui.jsx';
import { Users, UserPlus, Check, Star } from 'lucide-react';
import { calculateCompatibility, getMatchLabel } from '../../lib/matching.js';

export default function TeamMatch() {
  const { currentUser, state, sendTeamRequest } = useAppData();
  const [sentRequests, setSentRequests] = useState(new Set());

  // Find participants who are not in a team, excluding the current user
  const recommendations = useMemo(() => {
    if (!currentUser) return [];

    const others = state.users.filter(u => 
      u.role === 'participant' && 
      u.id !== currentUser.id && 
      (!u.teamId || u.teamId === '')
    );

    return others.map(user => {
      const score = calculateCompatibility(currentUser, user);
      return { ...user, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [currentUser, state.users]);

  const handleSendRequest = (userId) => {
    sendTeamRequest(userId);
    setSentRequests(prev => new Set([...prev, userId]));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Smart Team Match</h1>
        <p className="text-slate-500 mt-1">Find the perfect teammates for your project based on complementary skills and interests.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recommendations.map(p => {
          const { label, color } = getMatchLabel(p.matchScore);
          const hasRequested = sentRequests.has(p.id) || state.teamRequests?.some(r => r.fromUserId === currentUser?.id && r.toUserId === p.id && r.status === 'pending');

          return (
            <Card key={p.id} className="flex flex-col h-full hover:border-indigo-200 transition-colors">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-700">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{p.name}</h3>
                      <p className="text-sm text-slate-500">{p.preferredRole || 'Generalist'}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${color} flex items-center gap-1`}>
                    <Star className="w-3 h-3" />
                    {p.matchScore}%
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.skills?.map(skill => (
                        <Badge key={skill} variant="default">{skill}</Badge>
                      )) || <span className="text-xs text-slate-400 italic">No skills listed</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.interests?.map(i => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-600">
                          {i}
                        </span>
                      )) || <span className="text-xs text-slate-400 italic">No interests listed</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                <Button 
                  className="w-full" 
                  variant={hasRequested ? 'secondary' : 'primary'}
                  disabled={hasRequested}
                  onClick={() => handleSendRequest(p.id)}
                >
                  {hasRequested ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Request Sent
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" /> Send Request
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      
      {recommendations.length === 0 && (
        <Card>
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No available participants found right now.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
