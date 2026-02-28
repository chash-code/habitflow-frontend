import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHabitsAPI, getLogsAPI, logHabitAPI, deleteLogAPI } from '../services/api';
import { CheckCircle, Circle, Plus, TrendingUp, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsRes, logsRes] = await Promise.all([getHabitsAPI(), getLogsAPI()]);
      setHabits(habitsRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isCompletedToday = (habitId) => {
    return logs.some(log => log.habit_id === habitId && log.completed_at === today);
  };

  const toggleHabit = async (habitId) => {
    const existingLog = logs.find(log => log.habit_id === habitId && log.completed_at === today);
    try {
      if (existingLog) {
        await deleteLogAPI(existingLog.id);
        setLogs(logs.filter(l => l.id !== existingLog.id));
      } else {
        const res = await logHabitAPI({ habit_id: habitId, completed_at: today });
        setLogs([...logs, res.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completedToday = habits.filter(h => isCompletedToday(h.id)).length;
  const streak = completedToday;

  if (loading) return (
    <div className="min-h-screen bg-[#0f0e17] flex items-center justify-center">
      <div className="text-[#6C63FF] text-xl animate-pulse">Loading your habits...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0e17] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            <span className="text-[#6C63FF]">{user?.user_metadata?.name || 'Habit Hero'}!</span>
          </h1>
          <p className="text-gray-400 mt-1">{new Date().toDateString()}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Habits", value: habits.length, icon: Calendar, color: "#6C63FF" },
            { label: "Done Today", value: `${completedToday}/${habits.length}`, icon: CheckCircle, color: "#48CAE4" },
            { label: "Total Logs", value: logs.length, icon: TrendingUp, color: "#F72585" },
            { label: "Completion %", value: habits.length ? `${Math.round((completedToday/habits.length)*100)}%` : '0%', icon: Award, color: "#ffd60a" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#16213e] rounded-2xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{label}</span>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Today's Habits */}
        <div className="bg-[#16213e] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Today's Habits</h2>
            <Link to="/habits" className="flex items-center gap-1 bg-[#6C63FF] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6C63FF]/80 transition">
              <Plus size={16} /> Add Habit
            </Link>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-400 mb-4">No habits yet. Start building!</p>
              <Link to="/habits" className="bg-[#6C63FF] text-white px-6 py-3 rounded-xl inline-block hover:bg-[#6C63FF]/80 transition">
                Add Your First Habit
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map(habit => {
                const done = isCompletedToday(habit.id);
                return (
                  <div key={habit.id} onClick={() => toggleHabit(habit.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition
                      ${done ? 'bg-[#6C63FF]/10 border-[#6C63FF]/30' : 'bg-[#0f0e17] border-white/5 hover:border-[#6C63FF]/20'}`}>
                    {done ? <CheckCircle className="text-[#6C63FF] flex-shrink-0" size={24} /> : <Circle className="text-gray-600 flex-shrink-0" size={24} />}
                    <div className="flex-1">
                      <p className={`font-medium ${done ? 'text-[#6C63FF] line-through' : 'text-white'}`}>{habit.name}</p>
                      <p className="text-gray-500 text-sm">{habit.category} • {habit.difficulty}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${done ? 'bg-[#6C63FF]/20 text-[#6C63FF]' : 'bg-gray-800 text-gray-400'}`}>
                      {done ? '✓ Done' : 'Tap to complete'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
