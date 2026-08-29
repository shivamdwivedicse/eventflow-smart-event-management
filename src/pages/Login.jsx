import { useAppData } from '../context/AppDataContext.jsx';
import { Card, CardContent, Button } from '../components/ui.jsx';
import { LayoutDashboard, Users, User, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Login() {
  const { state, loginAs, loginWithEmail, hasSupabase, currentUser } = useAppData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

  const handleDemoLogin = (user) => {
    loginAs(user.id);
    navigate(`/${user.role}`);
  };

  const handleRealLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      // navigation is handled by the useEffect above when currentUser updates
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'participant': return <User className="w-6 h-6 text-indigo-500" />;
      case 'judge': return <CheckSquare className="w-6 h-6 text-emerald-500" />;
      case 'organizer': return <Users className="w-6 h-6 text-amber-500" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4">
          <LayoutDashboard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">EventFlow</h1>
        <p className="text-slate-500 mt-2">One platform. Every event. Real-time.</p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          {hasSupabase ? (
            <form onSubmit={handleRealLogin} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Sign In</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your credentials to continue</p>
              </div>
              {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="mb-4 inline-flex items-center px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wide">
                  Development Mode
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Demo Role Selector</h2>
                <p className="text-sm text-slate-500 mt-1">Select a mock user to continue (Supabase not configured)</p>
              </div>

              <div className="space-y-3">
                {state.users.slice(0, 3).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleDemoLogin(user)}
                    className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all bg-white text-left group"
                  >
                    <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role} View</p>
                    </div>
                    <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                      &rarr;
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
