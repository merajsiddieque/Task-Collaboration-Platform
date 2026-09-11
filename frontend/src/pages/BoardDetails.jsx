import { useState } from "react";
import { useParams } from "react-router-dom";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { motion } from "framer-motion";
import useBoardData from "../hooks/useBoardData";
import useBoardSearch from "../hooks/useBoardSearch";
import useBoardSocket from "../hooks/useBoardSocket";
import BoardNavbar from "../components/BoardNavbar";
import ListColumn from "../components/ListColumn";
import ActivitySidebar from "../components/ActivitySidebar";
import axios from "../api/axios";
import { Plus, Loader2 } from "lucide-react";

export default function BoardDetails() {
  const { id } = useParams();
  const [filterPriority, setFilterPriority] = useState("");
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  /* ================= DATA HOOKS ================= */

  const {
    board,
    lists,
    tasks,
    members,
    setTasks,
    setLists,
    loading,
    fetchLists,
    fetchBoard,
  } = useBoardData(id);

  const { searchQuery, setSearchQuery, isSearching } = useBoardSearch(
    id,
    setTasks,
    fetchLists
  );

  useBoardSocket(id, setTasks);

  /* ================= ACTIONS ================= */

  const createList = async (e) => {
    if (e) e.preventDefault();
    const title = newListTitle.trim();
    if (!title) return;

    try {
      const res = await axios.post("/lists", {
        title,
        boardId: id,
      });

      setLists((prev) => [...prev, res.data]);
      setTasks((prev) => ({
        ...prev,
        [res.data._id]: [],
      }));
      setNewListTitle("");
      setAddingList(false);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const deleteList = async (listId) => {
    if (!window.confirm("Are you sure you want to delete this list and all its tasks?")) return;

    try {
      await axios.delete(`/lists/${listId}`);
      setLists((prev) => prev.filter((l) => l._id !== listId));
      setTasks((prev) => {
        const copy = { ...prev };
        delete copy[listId];
        return copy;
      });
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const createTask = async (listId) => {
    const title = prompt("Enter task title:");
    if (!title || !title.trim()) return;

    try {
      await axios.post("/tasks", {
        title: title.trim(),
        listId,
        boardId: id,
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const inviteMember = async () => {
    const email = prompt("Enter team member's email to invite to this board:");
    if (!email) return;

    try {
      await axios.post(`/boards/${id}/invite`, { email: email.trim() });
      alert("Member invited successfully!");
      if (fetchBoard) fetchBoard();
    } catch (error) {
      alert(error.response?.data?.message || "Error inviting member");
    }
  };

  /* ================= UPDATE TASK STATE ================= */

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prev) => {
      const newTasks = { ...prev };

      for (let listId in newTasks) {
        newTasks[listId] = newTasks[listId].map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      }

      return newTasks;
    });
  };

  /* ================= DRAG HANDLER ================= */

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    let sourceListId = null;
    let targetListId = null;
    let movedTask = null;
    let newPosition = 0;

    setTasks((prev) => {
      const newTasks = { ...prev };

      // Find source
      for (let listId in newTasks) {
        const index = newTasks[listId].findIndex((t) => t._id === active.id);
        if (index !== -1) {
          sourceListId = listId;
          movedTask = newTasks[listId][index];
          newTasks[listId].splice(index, 1);
          break;
        }
      }

      // Find target
      if (newTasks[over.id]) {
        targetListId = over.id;
        newPosition = newTasks[targetListId].length;
      } else {
        for (let listId in newTasks) {
          const index = newTasks[listId].findIndex((t) => t._id === over.id);
          if (index !== -1) {
            targetListId = listId;
            newPosition = index;
            break;
          }
        }
      }

      if (!targetListId) return prev;

      newTasks[targetListId].splice(newPosition, 0, movedTask);

      // Recalculate positions
      newTasks[targetListId].forEach((task, i) => {
        task.position = i;
      });

      if (sourceListId !== targetListId) {
        newTasks[sourceListId].forEach((task, i) => {
          task.position = i;
        });
      }

      return newTasks;
    });

    // Persist to backend
    if (movedTask) {
      try {
        await axios.put(`/tasks/${movedTask._id}`, {
          listId: targetListId,
          position: newPosition,
        });
      } catch (error) {
        console.error("Error moving task:", error);
      }
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-400">
          Loading Kanban Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white relative overflow-hidden selection:bg-indigo-500 selection:text-white pb-10">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,.22),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,.18),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        {/* Board Header Navbar */}
        <BoardNavbar
          boardTitle={board?.title || "Project Board"}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          members={members}
          onInvite={inviteMember}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          onAddList={() => setAddingList(true)}
        />

        {/* Main Kanban & Activity Viewport */}
        <main className="flex gap-6 items-start overflow-hidden pt-2">
          {/* Kanban Board Container with horizontal snap scroll per spec */}
          <section className="flex-1 min-w-0 flex flex-col">
            <DndContext
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x custom-scrollbar pt-1 px-1">
                {/* Kanban List Columns */}
                {lists.map((list, idx) => {
                  const columnTasks = tasks[list._id] || [];

                  return (
                    <ListColumn
                      key={list._id}
                      index={idx}
                      list={list}
                      tasks={columnTasks}
                      members={members}
                      onDeleteList={deleteList}
                      onCreateTask={createTask}
                      onDeleteTask={deleteTask}
                      onTaskUpdate={handleTaskUpdate}
                    />
                  );
                })}

                {/* Inline Add List Card */}
                <div className="w-[320px] flex-shrink-0 snap-start">
                  {addingList ? (
                    <motion.form
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={createList}
                      className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3"
                    >
                      <input
                        type="text"
                        autoFocus
                        placeholder="Enter list title..."
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={!newListTitle.trim()}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md disabled:opacity-50 transition"
                        >
                          Add List
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingList(false);
                            setNewListTitle("");
                          }}
                          className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingList(true)}
                      className="w-full py-8 px-5 rounded-3xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition duration-200 group cursor-pointer"
                    >
                      <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
                      <span>Add Another List</span>
                    </button>
                  )}
                </div>
              </div>
            </DndContext>
          </section>

          {/* Sticky Activity Sidebar */}
          <ActivitySidebar boardId={id} members={members} />
        </main>
      </div>
    </div>
  );
}
