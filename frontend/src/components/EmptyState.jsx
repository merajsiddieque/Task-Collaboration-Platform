import { motion } from "framer-motion";
import { FolderPlus, Sparkles } from "lucide-react";

export default function EmptyState({ onFocusInput }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white/5 backdrop-blur-xl border border-dashed border-white/15"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-indigo-400">
          <FolderPlus className="w-10 h-10" />
        </div>
        <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-indigo-600 text-white shadow-lg">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
        Create your first collaborative workspace
      </h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        Manage sprints, assign tasks, and collaborate with your team in real time. Click below to start.
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={onFocusInput}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200"
      >
        <FolderPlus className="w-4 h-4" /> New Board
      </motion.button>
    </motion.div>
  );
}
