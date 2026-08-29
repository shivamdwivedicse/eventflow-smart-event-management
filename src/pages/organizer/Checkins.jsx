import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardContent, Badge, Button, Input } from '../../components/ui.jsx';
import { QrCode, Search, CheckCircle, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Checkins() {
  const { state, checkIn } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null);

  useEffect(() => {
    let scanner = null;
    if (scannerActive) {
      scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      
      scanner.render(async (decodedText) => {
        scanner.pause();
        try {
          const data = JSON.parse(decodedText);
          if (data.eid !== state.eventInfo.id) {
             setScanFeedback({ type: 'error', message: 'Invalid pass: Wrong event ID.' });
             setTimeout(() => scanner.resume(), 3000);
             return;
          }
          const result = await checkIn(data.pid);
          setScanFeedback({ type: result.success ? 'success' : 'error', message: result.message });
          setTimeout(() => scanner.resume(), 3000);
        } catch (e) {
          setScanFeedback({ type: 'error', message: 'Invalid QR code format.' });
          setTimeout(() => scanner.resume(), 3000);
        }
      }, () => {});
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Scanner clear error", e));
      }
    };
  }, [scannerActive, state.eventInfo.id]); // Note: excluding checkIn to avoid re-triggering scanner setup

  const handleManualCheckIn = async (userId) => {
    const result = await checkIn(userId);
    setScanFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    setTimeout(() => setScanFeedback(null), 3000);
  };

  const participants = state.users.filter(u => u.role === 'participant');
  const filtered = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Check-ins</h1>
          <p className="text-slate-500 mt-1">Manage participant arrivals and QR scans.</p>
        </div>
        <div className="w-full sm:w-auto flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              placeholder="Search name or ID..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setScannerActive(!scannerActive)} variant={scannerActive ? 'secondary' : 'primary'}>
            <Camera className="w-4 h-4 mr-2" />
            {scannerActive ? 'Close Scanner' : 'Scan QR'}
          </Button>
        </div>
      </header>

      {/* Accessibility Live Region */}
      <div aria-live="polite" className="sr-only">
        {scanFeedback ? scanFeedback.message : ''}
      </div>

      {scanFeedback && (
        <div className={`p-4 rounded-lg font-medium border ${scanFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {scanFeedback.message}
        </div>
      )}

      {scannerActive && (
        <Card className="p-4 bg-slate-900 text-white border-none shadow-xl">
          <div id="reader" className="mx-auto bg-white rounded-lg overflow-hidden w-full max-w-md"></div>
          <p className="text-center mt-4 text-slate-400 text-sm font-medium">Position the QR code within the frame.</p>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="Participant Check-ins">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">ID</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Name</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm text-slate-500 font-medium uppercase">{user.id.slice(0,8)}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{user.name}</td>
                  <td className="py-4 px-6">
                    {user.checkedIn ? (
                      <Badge variant="success" className="px-2.5 py-1">Checked In</Badge>
                    ) : (
                      <Badge variant="warning" className="px-2.5 py-1">Pending</Badge>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {user.checkedIn ? (
                      <span className="inline-flex items-center text-emerald-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-1.5" /> Verified
                      </span>
                    ) : (
                      <Button size="sm" onClick={() => handleManualCheckIn(user.id)}>
                        <QrCode className="w-4 h-4 mr-2" /> Manual Check-in
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No participants found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
