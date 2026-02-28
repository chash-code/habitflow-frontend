import { useState, useEffect } from 'react';
import { getHabitsAPI, getLogsAPI } from '../services/api';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Progress = () => {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [h, l] = await Promise.all([getHabitsAPI(), getLogsAPI()]);
        setHabits(h.data);
        setLogs(l.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const downloadPDF = async () => {
    const element = document.getElementById('progress-report');
    const canvas = await html2canvas(element, { backgroundColor: '#0f0e17', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('HabitFlow-Progress-Report.pdf');
  };

  const getHabitStats = (habitId) => {
    const habitLogs = logs.filter(l => l.habit_id === habitId);
    return habitLogs.length;
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  if (loading) return (
    <div className="min-h-screen bg-[#0f0e17] flex items-center justify-center">
      <div className="text-[#6C63FF] animate-pulse">Loading progress...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0e17] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Progress Report</h1>
          <button onClick={downloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#48CAE4] text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
            <Download size={18} /> Download PDF
          </button>
        </div>

        <div id="progress-report">
          {/* Weekly Overview */}
          <div className="bg-[#16213e] rounded-2xl p-6 border border-white/5 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Last 7 Days</h2>
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map(date => {
                const dayLogs = logs.filter(l => l.completed_at === date).length;
                return (
                  <div key={date} className="text-center">
                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold mb-1
                      ${dayLogs > 0 ? 'bg-[#6C63FF] text-white' : 'bg-[#0f0e17] text-gray-600'}`}>
                      {dayLogs}
                    </div>
                    <div className="text-gray-500 text-xs">{new Date(date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per Habit Stats */}
          <div className="bg-[#16213e] rounded-2xl p-6 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-4">Habit Performance</h2>
            <div className="space-y-4">
              {habits.map(habit => {
                const count = getHabitStats(habit.id);
                const maxPossible = 30;
                const pct = Math.min((count / maxPossible) * 100, 100);
                return (
                  <div key={habit.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">{habit.name}</span>
                      <span className="text-gray-400">{count} completions</span>
                    </div>
                    <div className="w-full bg-[#0f0e17] rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#48CAE4] transition-all duration-500"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {habits.length === 0 && <p className="text-gray-400 text-center py-4">No habits to show yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
