import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, UserPlus, FolderKanban, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function BoardCard({ board, onClick, onDelete, onInvite }) {
  const [isHovered, setIsHovered] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const members = board.members || [];
  const memberCount = Math.max(members.length, 1);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-3xl p-6 bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-400/30 hover:border-violet-400 transition duration-300 hover:shadow-[0_20px_60px_rgba(99,102,241,.35)] cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all pointer-events-none"></div>

      <div>
        {/* Top Row: Folder icon, Invite member icon, Delete icon (only on hover) */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
            <FolderKanban className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5 z-10">
            {/* Invite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInvite(board._id);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-white/10 transition-colors"
              title="Add / Invite Member"
            >
              <UserPlus className="w-4 h-4" />
            </button>

            {/* Delete Button (Only on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(board._id);
              }}
              className={`p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
              title="Delete board"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle: Title & Description */}
        <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
          {board.title}
          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-indigo-400" />
        </h3>

        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
          Real-time collaborative workspace. Manage sprints, track velocity, and organize tasks.
        </p>
      </div>

      {/* Bottom Row: Member avatars, Task count, Status pill */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        {/* Overlapping Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            {members.slice(0, 3).map((m, idx) => (
              <div
                key={m._id || idx}
                className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-950 bg-gradient-to-tr from-indigo-500 to-violet-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md"
                title={m.name}
              >
                {getInitials(m.name)}
              </div>
            ))}
            {members.length > 3 && (
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-950 bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                +{members.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-slate-400">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>

        {/* Status Badge */}
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
          Active
        </span>
      </div>
    </motion.div>
  );
}
