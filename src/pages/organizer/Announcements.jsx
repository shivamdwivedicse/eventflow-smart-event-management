import { useAppData } from '../../context/AppDataContext.jsx';
import { AnnouncementsView } from '../../components/SharedViews.jsx';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label } from '../../components/ui.jsx';
import { PlusCircle, Send, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Announcements() {
  const { publishAnnouncement } = useAppData();
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('low');
  const [error, setError] = useState('');

  const handlePublish = async () => {
    if (!title.trim() || !message.trim()) {
      setError('Title and message are required.');
      return;
    }

    const result = await publishAnnouncement({ title, message, priority });
    
    if (result.success) {
      setIsComposing(false);
      setTitle('');
      setMessage('');
      setPriority('low');
      setError('');
    } else {
      setError(result.message || 'Failed to publish announcement.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* Header is handled by AnnouncementsView, but we can augment here if needed */}
        </div>
        {!isComposing && (
          <Button onClick={() => setIsComposing(true)}>
            <PlusCircle className="w-4 h-4 mr-2" /> New Announcement
          </Button>
        )}
      </div>

      {isComposing && (
        <Card className="mb-8 border-indigo-200 shadow-sm">
          <CardHeader className="bg-indigo-50/50">
            <CardTitle>Compose Announcement</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {error && (
              <div aria-live="polite" className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Lunch is served!" 
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <textarea 
                id="message" 
                rows="3"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Details of the announcement..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select 
                id="priority" 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="low">Normal</option>
                <option value="high">Important (Urgent)</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsComposing(false)}>Cancel</Button>
              <Button onClick={handlePublish}>
                <Send className="w-4 h-4 mr-2" /> Broadcast
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <AnnouncementsView />
    </div>
  );
}
