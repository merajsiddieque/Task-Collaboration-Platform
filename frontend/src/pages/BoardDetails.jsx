import { useParams } from "react-router-dom";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import useBoardData from "../hooks/useBoardData";
import useBoardSearch from "../hooks/useBoardSearch";
import useBoardSocket from "../hooks/useBoardSocket";
import TaskCard from "../components/TaskCard";
import BoardNavbar from "../components/BoardNavbar";
import ActivityPanel from "../components/ActivityPanel";
import axios from "../api/axios";

export default function BoardDetails() {
  const { id } = useParams();

  /* ================= DATA HOOKS ================= */

  const { lists, tasks, members, setTasks, setLists, loading, fetchLists } =
    useBoardData(id);

  const { searchQuery, setSearchQuery, isSearching } = useBoardSearch(
    id,
    setTasks,
    fetchLists
  );

  useBoardSocket(id, setTasks);

  /* ================= ACTIONS ================= */

  const createList = async () => {
    const title = prompt("Enter list title:");
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
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (listId) => {
    const title = prompt("Enter task title:");
    if (!title) return;

    try {
      await axios.post("/tasks", {
        title,
        listId,
        boardId: id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.log(error);
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
        const index = newTasks[listId].findIndex(
          (t) => t._id === active.id
        );
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
          const index = newTasks[listId].findIndex(
            (t) => t._id === over.id
          );
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

    // Persist
    if (movedTask) {
      try {
        await axios.put(`/tasks/${movedTask._id}`, {
          listId: targetListId,
          position: newPosition,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading board...</h2>;
  }

  /* ================= UI ================= */

  return (
    <div style={styles.page}>
      <BoardNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
      />

      <div style={styles.contentWrapper}>
        {/* BOARD SECTION */}
        <div style={styles.boardSection}>
          <button style={styles.addListBtn} onClick={createList}>
            + Add List
          </button>

          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div style={styles.listContainer}>
              {lists.map((list) => (
                <div key={list._id} style={styles.listCard}>
                  <h3>{list.title}</h3>

                  <SortableContext
                    items={(tasks[list._id] || []).map((t) => t._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {(tasks[list._id] || []).map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        members={members}
                        onDelete={deleteTask}
                        onTaskUpdate={handleTaskUpdate}
                      />
                    ))}
                  </SortableContext>

                  <button
                    style={styles.addTaskBtn}
                    onClick={() => createTask(list._id)}
                  >
                    + Add Task
                  </button>
                </div>
              ))}
            </div>
          </DndContext>
        </div>

        {/* ACTIVITY PANEL */}
        <div style={styles.activityWrapper}>
          <ActivityPanel boardId={id} />
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "30px",
  },

  contentWrapper: {
    display: "flex",
    gap: "25px",
    alignItems: "flex-start",
    flexWrap: "wrap", // 🔥 responsive fix
  },

  boardSection: {
    flex: 1,
    minWidth: "600px",
  },

  activityWrapper: {
    width: "280px",
    minWidth: "240px",
    flexShrink: 0,
  },

  listContainer: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
  },

  listCard: {
    minWidth: "260px",
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  addListBtn: {
    marginBottom: "20px",
    padding: "10px 15px",
    borderRadius: "8px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  addTaskBtn: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#667eea",
    color: "white",
    cursor: "pointer",
  },
};
