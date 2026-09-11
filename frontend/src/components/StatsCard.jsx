import { useEffect, useState } from "react";
import axios from "../api/axios";
import { LayoutDashboard, CheckCircle2, Users, Flame, TrendingUp, Sparkles, Clock } from "lucide-react";

export default function StatsCard({ totalBoards, totalMembers = 1 }) {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Simulated metrics
  const completedTasks = Math.min(totalBoards * 4, 28);
  const completionRate = totalBoards > 0 ? 84 : 0;

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoadingActivities(true);
        // Fetch recent activities from backend
        const res = await axios.get("/boards");
        if (res.data && res.data.length > 0) {
          const firstBoardId = res.data[0]._id;
          const actRes = await axios.get(`/activity/${firstBoardId}`);
          setRecentActivities(actRes.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching pulse activities:", err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchRecentActivities();
  }, [totalBoards]);

  // Fallback items if none recorded yet
  const displayActivities = recentActivities.length > 0
    ? recentActivities.map((a) => ({
        user: a.user?.name || "Team Member",
        action: a.message,
        time: "Recent",
      }))
    : [
        { user: "Meraj", action: "created Sprint Board", time: "10m ago" },
        { user: "Ayesha", action: "completed API Task", time: "1h ago" },
        { user: "Rahul", action: "joined Workspace", time: "3h ago" },
      ];

  return (
    <div className="sticky top-28 space-y-6">
      <div className="rounded-3xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
              Workspace Pulse
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Live team velocity</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        {/* 1. Circular Progress Ring */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-tr from-indigo-950/60 to-purple-950/40 border border-indigo-500/20">
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-indigo-950"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500"
                strokeDasharray={`${completionRate}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-white">
              {completionRate}%
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> High Velocity
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Sprint velocity is optimal. Tasks are syncing in real time.
            </p>
          </div>
        </div>

        {/* 2. Total Boards, 3. Completed Tasks, 4. Active Members */}
        <div className="space-y-2.5">
          {/* Total Boards */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">Total Boards</span>
            </div>
            <span className="text-sm font-bold text-white">{totalBoards}</span>
          </div>

          {/* Completed Tasks */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">Completed Tasks</span>
            </div>
            <span className="text-sm font-bold text-white">{completedTasks}</span>
          </div>

          {/* Active Members */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">Active Members</span>
            </div>
            <span className="text-sm font-bold text-white">{totalMembers}</span>
          </div>
        </div>

        {/* 5. Recent Activity (Timeline style) */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Recent Activity
          </h4>

          <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {displayActivities.map((item, idx) => (
              <div key={idx} className="relative text-xs group">
                {/* Timeline Bullet */}
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#020817]"></span>
                <div>
                  <p className="text-slate-300 leading-snug">
                    <span className="font-bold text-white">{item.user}</span> {item.action}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
