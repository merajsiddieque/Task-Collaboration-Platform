import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Clock, Activity, Users } from "lucide-react";

export default function ActivitySidebar({ boardId, members = [] }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`/activity/${boardId}`);
        setActivities(res.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [boardId]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMin = Math.floor((now - date) / (1000 * 60));
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <aside className="w-[320px] flex-shrink-0 flex flex-col space-y-6 sticky top-28">
      {/* Activity Timeline Card */}
      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Activity Stream
            </h3>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
            Live
          </span>
        </div>

        {/* Timeline list */}
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Loading activity stream...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No activity recorded yet.
          </div>
        ) : (
          <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10 max-h-[380px] overflow-y-auto pr-1">
            {activities.map((activity, idx) => (
              <div key={activity._id || idx} className="relative text-xs">
                {/* Timeline Bullet */}
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#020817]"></span>

                <div>
                  <p className="text-slate-300 leading-snug">
                    <span className="font-bold text-white">
                      {activity.user?.name || "Member"}
                    </span>{" "}
                    {activity.message}
                  </p>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTime(activity.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Board Members Summary Card */}
      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Board Members
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {members.length} total
          </span>
        </div>

        <div className="space-y-2.5 max-h-[160px] overflow-y-auto">
          {members.map((m) => (
            <div key={m._id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                  {getInitials(m.name)}
                </div>
                <span className="text-xs font-medium text-slate-300 truncate">
                  {m.name}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500">
                Collaborator
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
