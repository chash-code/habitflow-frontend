import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMsg = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginAPI(form);
      const { user, session } = res.data.data;
      login(user, session.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e17] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#16213e] rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-center mb-6">
          <Activity className="text-[#6C63FF] mr-2" size={28} />
          <span className="text-2xl font-bold text-white">Habit<span className="text-[#6C63FF]">Flow</span></span>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8">Continue your habit journey</p>

        {successMsg && <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-4 text-sm">{successMsg}</div>}
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input type="email" placeholder="you@email.com" required
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full bg-[#0f0e17] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-[#6C63FF] outline-none transition" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input type="password" placeholder="Your password" required
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              className="w-full bg-[#0f0e17] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-[#6C63FF] outline-none transition" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-[#6C63FF] to-[#48CAE4] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#6C63FF] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
