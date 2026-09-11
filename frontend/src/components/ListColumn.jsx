import { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { MoreHorizontal, Trash2, Plus } from "lucide-react";

export default function ListColumn({
  list,
  tasks = [],
  members = [],
  onDeleteList,
  onCreateTask,
  onDeleteTask,
  onTaskUpdate,
  index = 0,
}) {
  const [showMenu, setShowMenu] = useState(false);

  // Colored top border per spec: Todo = Blue, Progress = Amber, Done = Emerald
  const listTitleLower = list.title.toLowerCase();
  let topBorderColor = "border-t-indigo-500";

  if (listTitleLower.includes("todo") || listTitleLower.includes("to do") || index === 0) {
    topBorderColor = "border-t-blue-500";
  } else if (listTitleLower.includes("progress") || listTitleLower.includes("doing") || index === 1) {
    topBorderColor = "border-t-amber-500";
  } else if (listTitleLower.includes("done") || listTitleLower.includes("complete") || index === 2) {
    topBorderColor = "border-t-emerald-500";
  }

  return (
    <div
      className={`w-[320px] flex-shrink-0 rounded-3xl bg-white/5 border border-white/10 p-4 border-t-4 ${topBorderColor} flex flex-col shadow-2xl backdrop-blur-xl snap-start`}
    >
      {/* Header: Title + Task Count + Menu */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5 min-w-0">
          <h3 className="text-base font-bold text-white tracking-tight truncate">
            {list.title}
          </h3>
          <span className="inline-flex items-center justify-center text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
            {tasks.length}
          </span>
        </div>

        {/* Menu (•••) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="List actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-7 w-36 py-1.5 bg-slate-900 rounded-2xl shadow-2xl border border-white/10 z-30 animate-fade-in">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  if (onDeleteList) onDeleteList(list._id);
                }}
                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Cards List (Sortable Area) */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-0.5">
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              members={members}
              onDelete={onDeleteTask}
              onTaskUpdate={onTaskUpdate}
            />
          ))}
        </SortableContext>

        {/* If no tasks: Dashed card per spec */}
        {tasks.length === 0 && (
          <button
            type="button"
            onClick={() => onCreateTask(list._id)}
            className="w-full py-8 text-center text-xs text-slate-400 hover:text-indigo-300 border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-2xl transition cursor-pointer"
          >
            + Add your first task
          </button>
        )}
      </div>

      {/* Add Task Button per spec */}
      <div className="pt-3 mt-3 border-t border-white/5">
        <button
          type="button"
          onClick={() => onCreateTask(list._id)}
          className="w-full rounded-2xl border-2 border-dashed border-slate-600 py-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-300 transition text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}
