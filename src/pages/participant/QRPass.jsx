import QRCode from 'react-qr-code';
import { useAppData } from '../../context/AppDataContext.jsx';
import { Card, CardContent } from '../../components/ui.jsx';
import { CheckCircle, Clock } from 'lucide-react';

export default function QRPass() {
  const { currentUser, state } = useAppData();

  const qrPayload = JSON.stringify({ pid: currentUser.id, eid: state.eventInfo.id });

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My QR Pass</h1>
        <p className="text-slate-500 mt-1">Show this at the registration desk</p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-indigo-600 px-6 py-8 text-center text-white">
          <h2 className="font-bold text-2xl mb-1">{state.eventInfo.name}</h2>
          <p className="text-indigo-100 opacity-90">{state.eventInfo.date}</p>
        </div>
        <CardContent className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6" role="img" aria-label="QR Code for Event Check-in">
            <QRCode 
              value={qrPayload}
              size={200}
              level="M"
            />
          </div>
          
          <div className="text-center w-full">
            <h3 className="text-2xl font-bold text-slate-900">{currentUser.name}</h3>
            <p className="text-slate-500 uppercase tracking-widest text-sm mt-1 mb-6">
              ID: {currentUser.id.slice(0, 8).toUpperCase()}
            </p>

            <div className={`
              flex items-center justify-center gap-2 py-3 px-4 rounded-lg w-full font-medium
              ${currentUser.checkedIn ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
            `}>
              {currentUser.checkedIn ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Verified & Checked In
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  Awaiting Check-in
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
