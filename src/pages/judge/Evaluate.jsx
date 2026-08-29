import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent, Button, Label, Input } from '../../components/ui.jsx';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Evaluate() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser, state, submitEvaluation } = useAppData();
  
  const project = state.projects.find(p => p.id === projectId);
  const team = project ? state.teams.find(t => t.id === project.teamId) : null;
  const isAssigned = currentUser?.assignedProjects?.includes(projectId);

  const [scores, setScores] = useState(
    project?.scores || {
      innovation: '',
      technical: '',
      impact: '',
      uiux: '',
      presentation: ''
    }
  );
  
  const [feedback, setFeedback] = useState(project?.feedback || '');
  const [error, setError] = useState('');

  if (!project) return <div className="p-8 text-center text-slate-500">Project not found.</div>;
  if (!isAssigned) return <div className="p-8 text-center text-red-500">Unauthorized. You are not assigned to evaluate this project.</div>;

  const handleScoreChange = (criteria, value) => {
    let val = parseInt(value, 10);
    if (isNaN(val)) val = '';
    else if (val < 0) val = 0;
    else if (val > 20) val = 20;

    setScores(prev => ({ ...prev, [criteria]: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate scores
    const missing = Object.values(scores).some(v => v === '');
    if (missing) {
      setError('Please provide a score (0-20) for all criteria.');
      return;
    }

    if (!feedback.trim()) {
      setError('Please provide constructive feedback.');
      return;
    }

    const result = await submitEvaluation(projectId, scores, feedback);
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate('/judge/projects');
  };

  const totalScore = Object.values(scores).reduce((sum, val) => sum + (Number(val) || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Evaluate: {project.name}</h1>
            <p className="text-slate-500 mt-1">Team: {team?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 font-medium">Total Score</p>
            <p className="text-3xl font-bold text-indigo-600">{totalScore} <span className="text-lg text-slate-400">/ 100</span></p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Rubric</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div aria-live="polite" className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { id: 'innovation', label: 'Innovation', desc: 'Originality and creativity of the idea.' },
                { id: 'technical', label: 'Technical Implementation', desc: 'Complexity and code quality.' },
                { id: 'impact', label: 'Impact', desc: 'Potential value and real-world usefulness.' },
                { id: 'uiux', label: 'UI/UX', desc: 'Design, accessibility, and user experience.' },
                { id: 'presentation', label: 'Presentation', desc: 'Pitch quality and demo execution.' }
              ].map(criteria => (
                <div key={criteria.id}>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor={criteria.id}>{criteria.label}</Label>
                    <span className="text-sm font-medium text-slate-400">Max 20</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{criteria.desc}</p>
                  <Input 
                    id={criteria.id}
                    type="number"
                    min="0"
                    max="20"
                    value={scores[criteria.id]}
                    onChange={(e) => handleScoreChange(criteria.id, e.target.value)}
                    placeholder="0-20"
                    className="w-full text-lg"
                  />
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <Label htmlFor="feedback">Constructive Feedback <span className="text-red-500">*</span></Label>
              <p className="text-xs text-slate-500 mb-2">Private comments for the team.</p>
              <textarea 
                id="feedback"
                required
                aria-required="true"
                rows="4"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Great job on..."
              ></textarea>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit">
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Evaluation
          </Button>
        </div>
      </form>
    </div>
  );
}
