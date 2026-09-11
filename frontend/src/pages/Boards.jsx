import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BoardCard from "../components/BoardCard";
import StatsCard from "../components/StatsCard";
import EmptyState from "../components/EmptyState";
import { FolderPlus, Sparkles, Loader2 } from "lucide-react";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/boards");
      setBoards(res.data);
    } catch (error) {
      console.error("Failed to fetch boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || creating) return;

    try {
      setCreating(true);
      const res = await axios.post("/boards", { title: title.trim() });
      setBoards((prev) => [res.data, ...prev]);
      setTitle("");
    } catch (error) {
      console.error("Failed to create board:", error);
    } finally {
      setCreating(false);
    }
  };

  const deleteBoard = async (boardId) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    try {
      await axios.delete(`/boards/${boardId}`);
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
    } catch (error) {
      console.error("Failed to delete board:", error);
    }
  };

  const inviteBoard = async (boardId) => {
    const email = prompt("Enter team member's email to invite to this board:");
    if (!email) return;

    try {
      await axios.post(`/boards/${boardId}/invite`, { email: email.trim() });
      alert("Member invited successfully!");
      fetchBoards();
    } catch (error) {
      alert(error.response?.data?.message || "Error inviting member");
    }
  };

  // Calculate unique members count across boards
  const memberSet = new Set();
  boards.forEach((b) => {
    (b.members || []).forEach((m) => {
      if (m?.email) memberSet.add(m.email);
      else if (m?._id) memberSet.add(m._id);
    });
  });
  const totalMembers = Math.max(memberSet.size, 1);

  return (
    <div className="min-h-screen bg-[#020817] text-white relative overflow-hidden selection:bg-indigo-500 selection:text-white pb-12">
      {/* Background Radial Glow Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,.22),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,.18),transparent_40%)] pointer-events-none" />

      {/* Top Navbar */}
      <Navbar />

      {/* Dashboard Layout: 12-column grid (Left 8 cols, Right 4 cols) */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8 relative z-10"
      >
        {/* Left Column (8 columns): Hero, Create Board, Board Grid */}
        <section className="lg:col-span-8 space-y-8">
          {/* Hero Section */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>SaaS Project Hub</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white">
              Your Boards
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Manage projects, organize sprints and collaborate in real-time.
            </p>
          </div>

          {/* Create Board Input Bar */}
          <form
            onSubmit={createBoard}
            className="flex gap-4 p-2 rounded-2xl bg-white/5 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 backdrop-blur-xl transition shadow-xl"
          >
            <div className="pl-4 flex items-center text-indigo-400">
              <FolderPlus size={20} />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter new board title..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 text-sm"
            />

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              type="submit"
              disabled={!title.trim() || creating}
              className="rounded-xl px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>+ Create Board</span>
              )}
            </motion.button>
          </form>

          {/* Board Grid: responsive 1, 2, 3 cols with 24px gap */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-52 rounded-3xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : boards.length === 0 ? (
            <EmptyState onFocusInput={() => inputRef.current?.focus()} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {boards.map((board) => (
                <BoardCard
                  key={board._id}
                  board={board}
                  onClick={() => navigate(`/boards/${board._id}`)}
                  onDelete={deleteBoard}
                  onInvite={inviteBoard}
                />
              ))}
            </div>
          )}
        </section>

        {/* Right Column (4 columns): Sticky Workspace Pulse Sidebar */}
        <aside className="lg:col-span-4">
          <StatsCard totalBoards={boards.length} totalMembers={totalMembers} />
        </aside>
      </motion.main>
    </div>
  );
}
