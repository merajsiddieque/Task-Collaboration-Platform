import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "../api/axios";
import { Trash2, GripVertical, Calendar, Flag } from "lucide-react";

export default function TaskCard({ task, members = [], onDelete, onTaskUpdate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  // ✅ Multi-assign handler (preserves existing backend API)
  const handleAssign = async (userIds) => {
    try {
      setAssigning(true);
      const res = await axios.put(`/tasks/${task._id}`, {
        assignedTo: userIds,
      });

      if (onTaskUpdate) {
        onTaskUpdate(res.data);
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    } finally {
      setAssigning(false);
    }
  };

  // Priority styling based on user spec: Low = Emerald, Medium = Amber, High = Rose
  const priorities = [
    { label: "High", badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
    { label: "Medium", badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
    { label: "Low", badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  ];
  const priority = priorities[task._id ? task._id.charCodeAt(task._id.length - 1) % priorities.length : 1];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-2xl bg-slate-900/70 border border-white/5 p-4 space-y-3 hover:shadow-lg hover:border-indigo-400/40 transition group cursor-pointer ${
        isDragging ? "opacity-40 ring-2 ring-indigo-500 shadow-2xl z-50" : ""
      }`}
    >
      {/* Top Header Row: Priority Badge + Due Date Chip + Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Priority Badge */}
          <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${priority.badgeClass}`}>
            {priority.label}
          </span>

          {/* Due date chip */}
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
            <Calendar className="w-3 h-3 text-slate-400" /> Today
          </span>
        </div>

        {/* Delete button & Grip handle */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className={`p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div
            {...attributes}
            {...listeners}
            className="p-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing rounded hover:bg-white/5 transition-colors"
            title="Drag task"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Task Title & Description */}
      <div>
        <h4
          {...attributes}
          {...listeners}
          className="text-sm font-semibold text-white tracking-tight leading-snug cursor-grab"
        >
          {task.title}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          Sprint item tracked with real-time updates and collaboration.
        </p>
      </div>

      {/* Footer Row: Assignee Avatar + Member Dropdown */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
        {/* Assignee Avatar Stack */}
        <div className="flex items-center">
          {task.assignedTo && task.assignedTo.length > 0 ? (
            <div className="flex -space-x-1.5 overflow-hidden">
              {task.assignedTo.map((user) => (
                <div
                  key={user._id}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-indigo-500 to-violet-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md"
                  title={user.name}
                >
                  {getInitials(user.name)}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">Unassigned</span>
          )}
        </div>

        {/* Member Assignment Dropdown */}
        <select
          onChange={(e) => {
            const selectedId = e.target.value;
            if (!selectedId) return;

            let updatedUsers = [];
            const alreadyAssigned = task.assignedTo?.some(
              (u) => u._id === selectedId
            );

            if (alreadyAssigned) {
              updatedUsers = task.assignedTo.filter((u) => u._id !== selectedId);
            } else {
              const userToAdd = members.find((m) => m._id === selectedId);
              if (userToAdd) {
                updatedUsers = [...(task.assignedTo || []), userToAdd];
              }
            }

            handleAssign(updatedUsers.map((u) => u._id));
          }}
          value=""
          disabled={assigning}
          className="text-[11px] font-medium py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          <option value="" className="bg-slate-900 text-white">+ Assign</option>
          {members.map((member) => {
            const isAssigned = task.assignedTo?.some((u) => u._id === member._id);
            return (
              <option key={member._id} value={member._id} className="bg-slate-900 text-white">
                {isAssigned ? `✓ ${member.name}` : member.name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
