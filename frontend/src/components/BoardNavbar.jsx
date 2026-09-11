import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, Plus, Brain, UserPlus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function BoardNavbar({
  boardTitle = "Board",
  searchQuery,
  setSearchQuery,
  isSearching,
  members = [],
  onInvite,
  filterPriority,
  setFilterPriority,
  onAddList,
}) {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-4 z-40 w-full mb-6">
      <nav className="h-[72px] mx-auto rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl px-6 py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xl">
        {/* Left: Back button & Board Title */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/boards")}
            className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Back to all boards"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Boards</span>
          </motion.button>

          <div className="h-6 w-px bg-white/10"></div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none flex items-center gap-2">
                {boardTitle}
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Sync
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Center: Search & Filter */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks or assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition"
            />
            {isSearching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400 font-medium animate-pulse">
                ...
              </span>
            )}
          </div>

          {/* Quick Priority Filter */}
          {setFilterPriority && (
            <div className="relative">
              <select
                value={filterPriority || ""}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="appearance-none pl-7 pr-6 py-2 text-xs font-semibold rounded-2xl bg-white/5 border border-white/10 text-slate-300 cursor-pointer focus:outline-none focus:border-indigo-500"
              >
                <option value="" className="bg-slate-900 text-white">All Priorities</option>
                <option value="High" className="bg-slate-900 text-white">🔴 High</option>
                <option value="Medium" className="bg-slate-900 text-white">🟡 Medium</option>
                <option value="Low" className="bg-slate-900 text-white">🟢 Low</option>
              </select>
              <Filter className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Right: Add List, Members, and Invite */}
        <div className="flex items-center gap-3">
          {/* Add List Trigger Button */}
          {onAddList && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onAddList}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add List</span>
            </motion.button>
          )}

          {/* Members Overlapping Avatars */}
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

          {/* Invite Button */}
          {onInvite && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onInvite}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
              title="Add member to board"
            >
              <UserPlus className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </nav>
    </header>
  );
}
