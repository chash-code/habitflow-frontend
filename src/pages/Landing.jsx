import { Link } from 'react-router-dom';
import { Activity, TrendingUp, Bell, Award, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0f0e17]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/20 to-[#48CAE4]/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center bg-[#6C63FF]/20 text-[#6C63FF] px-4 py-2 rounded-full text-sm mb-6">
            <Activity size={16} className="mr-2" /> Your Personal Habit Coach
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Build Better<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#48CAE4]">
              Habits Daily
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            HabitFlow helps you track, visualize, and celebrate your daily habits.
            Stay consistent, earn streaks, and achieve your personal goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"
              className="bg-gradient-to-r from-[#6C63FF] to-[#48CAE4] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2">
              Start for Free <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="border border-[#6C63FF]/50 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#6C63FF]/10 transition">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Everything You Need</h2>
          <p className="text-gray-400 text-center mb-12">Powerful features to keep you on track</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Activity, title: "Daily Tracking", desc: "Log habits with one click. Never miss a day.", color: "#6C63FF" },
              { icon: TrendingUp, title: "Progress Streaks", desc: "Visual streaks to keep you motivated.", color: "#48CAE4" },
              { icon: Bell, title: "Smart Reminders", desc: "Custom notifications for each habit.", color: "#F72585" },
              { icon: Award, title: "Achievements", desc: "Earn badges for hitting milestones.", color: "#ffd60a" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-[#16213e] rounded-2xl p-6 border border-white/5 hover:border-[#6C63FF]/30 transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}20` }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-[#6C63FF]/20 to-[#48CAE4]/20 rounded-3xl p-12 border border-[#6C63FF]/30">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Flow?</h2>
          <p className="text-gray-400 mb-8">Join thousands building better habits every day.</p>
          <Link to="/signup"
            className="bg-gradient-to-r from-[#6C63FF] to-[#48CAE4] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition inline-flex items-center gap-2">
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
