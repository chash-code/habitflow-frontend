import { useState, useEffect } from 'react';
import { getHabitsAPI, createHabitAPI, deleteHabitAPI } from '../services/api';
import { Plus, Trash2, Edit } from 'lucide-react';

const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Mindfulness', 'Productivity', 'Social', 'General'];
const DIFFICULTIES = ['easy', 'moderate', 'hard'];

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'General', difficulty: 'easy', frequency: 'daily' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHabits(); }, []);

  const fetchHabits = async () => {
    try {
      const res = await getHabitsAPI();
      setHabits(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createHabitAPI(form);
      setHabits([res.data, ...habits]);
      setForm({ name: '', category: 'General', difficulty: 'easy', frequency: 'daily' });
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this habit?')) return;
    try {
      await deleteHabitAPI(id);
      setHabits(habits.filter(h => h.id !== id));
    } catch (err) { console.error(err); }
  };

  const difficultyColor = { easy: '#48CAE4', moderate: '#ffd60a', hard: '#F72585' };

  return (
    <div className="min-h-screen bg-[#0f0e17] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Habits</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#6C63FF] text-white px-4 py-2 rounded-xl hover:bg-[#6C63FF]/80 transition">
            <Plus size={18} /> New Habit
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-[#16213e] rounded-2xl p-6 border border-[#6C63FF]/30 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Create New Habit</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="Habit name (e.g., Morning Run)" required
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-[#0f0e17] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-[#6C63FF] outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="bg-[#0f0e17] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-[#6C63FF] outline-none">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}
                  className="bg-[#0f0e17] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-[#6C63FF] outline-none">
                  {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-[#6C63FF] text-white px-6 py-3 rounded-xl hover:bg-[#6C63FF]/80 transition">Create</button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-white/20 text-gray-400 px-6 py-3 rounded-xl hover:bg-white/5 transition">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Habits List */}
        <div className="space-y-3">
          {loading ? <p className="text-gray-400 text-center py-8">Loading...</p> :
           habits.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-400 text-lg">No habits yet! Create your first one.</p>
            </div>
           ) : habits.map(habit => (
            <div key={habit.id} className="bg-[#16213e] rounded-xl p-5 border border-white/5 hover:border-[#6C63FF]/20 transition flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">{habit.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-sm">{habit.category}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm font-medium" style={{ color: difficultyColor[habit.difficulty] }}>
                    {habit.difficulty}
                  </span>
                </div>
              </div>
              <button onClick={() => handleDelete(habit.id)}
                className="text-gray-600 hover:text-[#F72585] transition p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Habits;
