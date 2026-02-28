import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHabitsAPI, getLogsAPI, logHabitAPI, deleteLogAPI } from '../services/api';
import { CheckCircle, Circle, Plus, TrendingUp, Calendar, Award, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUOTES = [
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Motivation gets you going, but habit keeps you growing.", author: "John Maxwell" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Build habits so strong that your worst day is still better than most people's best.", author: "Anonymous" },
];

const Dashboard = () => {
  const { user, darkMode } = useAuth();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const today = new Date().toISOString().split('T')[0];

  // Rotate quote every 30 minutes
  useEffect(() => {
    const getQuoteIndex = () => {
      const minutes = Math.floor(Date.now() / 1000 / 60);
      return Math.floor(minutes / 30) % QUOTES.length;
    };
    setQuoteIndex(getQuoteIndex());
    const interval = setInterval(() => setQuoteIndex(getQuoteIndex()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { fetchData(); }, []);

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

  const isCompletedToday = (habitId) =>
    logs.some(log => log.habit_id === habitId && log.completed_at === today);

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
    } catch (err) { console.error(err); }
  };

  const completedToday = habits.filter(h => isCompletedToday(h.id)).length;

  const bg = darkMode ? 'bg-[#0f0e17]' : 'bg-[#f8f7ff]';
  const cardBg = darkMode ? 'bg-[#16213e] border-white/5' : 'bg-white border-gray-200';
  const text = darkMode ? 'text-white' : 'text-[#1a1a2e]';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';

  if (loading) return (
    <div className={`min-h-screen ${bg} flex items-center justify-center`}>
      <div className="text-[#6C63FF] text-xl animate-pulse">Loading your habits...</div>
    </div>
  );

  const quote = QUOTES[quoteIndex];

  return (
    <div className={`min-h-screen ${bg} p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${text}`}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            <span className="text-[#6C63FF]">{user?.user_metadata?.name || 'Habit Hero'}!</span>
          </h1>
          <p className={`mt-1 ${subtext}`}>{new Date().toDateString()}</p>
        </div>

        {/* Motivational Quote Card */}
        <div className="bg-gradient-to-r from-[#6C63FF]/20 to-[#48CAE4]/20 rounded-2xl p-6 border border-[#6C63FF]/30 mb-6">
          <div className="flex items-start gap-3">
            <Quote className="text-[#6C63FF] flex-shrink-0 mt-1" size={22} />
            <div>
              <p className={`text-lg font-medium italic leading-relaxed ${text}`}>"{quote.text}"</p>
              <p className="text-[#6C63FF] font-semibold mt-2">— {quote.author}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Habits", value: habits.length, color: "#6C63FF" },
            { label: "Done Today", value: `${completedToday}/${habits.length}`, color: "#48CAE4" },
            { label: "Total Logs", value: logs.length, color: "#F72585" },
            { label: "Completion", value: habits.length ? `${Math.round((completedToday / habits.length) * 100)}%` : '0%', color: "#ffd60a" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${cardBg} rounded-2xl p-4 border`}>
              <p className={`text-sm mb-1 ${subtext}`}>{label}</p>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Today's Habits */}
        <div className={`${cardBg} rounded-2xl p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${text}`}>Today's Habits</h2>
            <Link to="/habits"
              className="flex items-center gap-1 bg-[#6C63FF] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6C63FF]/80 transition">
              <Plus size={16} /> Add Habit
            </Link>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <p className={`mb-4 ${subtext}`}>No habits yet. Start building!</p>
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
                      ${done
                        ? 'bg-[#6C63FF]/10 border-[#6C63FF]/30'
                        : darkMode ? 'bg-[#0f0e17] border-white/5 hover:border-[#6C63FF]/20' : 'bg-gray-50 border-gray-200 hover:border-[#6C63FF]/30'}`}>
                    {done
                      ? <CheckCircle className="text-[#6C63FF] flex-shrink-0" size={24} />
                      : <Circle className={`flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={24} />}
                    <div className="flex-1">
                      <p className={`font-medium ${done ? 'text-[#6C63FF] line-through' : text}`}>{habit.name}</p>
                      <p className={`text-sm ${subtext}`}>{habit.category} • {habit.difficulty}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${done ? 'bg-[#6C63FF]/20 text-[#6C63FF]' : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                      {done ? '✓ Done' : 'Tap'}
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
