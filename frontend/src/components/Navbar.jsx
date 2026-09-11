import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Bell,
  Brain,
  Sparkles,
  CheckCheck,
  CheckCircle2,
  Database,
  Radio,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to TaskFlow",
      message: "Create boards, invite team members, and drag tasks in real-time.",
      time: "Just now",
      unread: true,
      icon: Sparkles,
      iconColor: "text-purple-400 bg-purple-500/10",
    },
    {
      id: 2,
      title: "Real-time Sync Active",
      message: "Live collaboration channel is online and synced.",
      time: "5m ago",
      unread: false,
      icon: Radio,
      iconColor: "text-indigo-400 bg-indigo-500/10",
    },
  ]);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getProfilePhoto = () => {
    if (user?.avatar) return user.avatar;
    if (user?.email) {
      return `https://unavatar.io/${encodeURIComponent(user.email)}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user.email)}&background=6366f1&color=fff&bold=true`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=6366f1&color=fff&bold=true`;
  };

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
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <nav className="h-[72px] mx-auto rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-2xl">
        {/* Left: Gradient Logo + TaskFlow title + Workspace badge */}
        <div
          onClick={() => navigate("/boards")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-200">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              TaskFlow
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-indigo-300 border border-white/10">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Workspace
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>
          {/* Notification Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className={`relative p-2.5 rounded-2xl transition-all duration-200 ${
              showNotifications
                ? "bg-white/10 text-indigo-400 border border-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
            title="Notifications"
            aria-label="Toggle notifications menu"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 ring-2 ring-[#020817]"></span>
              </span>
            )}
          </motion.button>

          {/* Notification Dropdown Popover */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-16 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl z-50 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Notifications</h4>
                    {unreadCount > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {unreadCount} new
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">
                        Caught up
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification Items List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="py-10 px-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-semibold text-white">No notifications</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        You are completely caught up with your workspace.
                      </p>
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => markAsRead(item.id)}
                          className={`group relative flex items-start gap-3 p-3.5 cursor-pointer transition-colors ${
                            item.unread
                              ? "bg-indigo-500/10 hover:bg-indigo-500/15"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconColor}`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-xs font-bold text-white truncate">
                                {item.title}
                              </h5>
                              {item.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {item.time}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-all absolute right-2.5 top-3"
                            title="Dismiss notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-2.5 bg-white/5 border-t border-white/10 text-center">
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 pl-1.5 py-1 pr-3.5 bg-white/5 rounded-2xl border border-white/10">
            {/* Profile Photo fetched from Google/Email */}
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center ring-1 ring-white/20 flex-shrink-0 shadow-inner">
              {!imgError ? (
                <img
                  src={getProfilePhoto()}
                  alt={user?.name || "Profile"}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span>{getInitials(user?.name)}</span>
              )}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">
                {user?.name || (user?.email ? user.email.split("@")[0] : "Member")}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Admin</p>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 bg-rose-500/10 border border-rose-500/20 transition-all duration-200"
            title="Logout of your account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </nav>
    </header>
  );
}
