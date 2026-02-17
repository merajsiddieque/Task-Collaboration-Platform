// hooks/useBoardSocket.js
import { useEffect } from "react";
import socket from "../socket";

export default function useBoardSocket(boardId, setTasks) {
  useEffect(() => {
    socket.emit("joinBoard", boardId);

    const handleTaskCreated = (task) => {
      setTasks((prev) => ({
        ...prev,
        [task.list]: [...(prev[task.list] || []), task],
      }));
    };

    const handleTaskDeleted = (taskId) => {
      setTasks((prev) => {
        const newTasks = { ...prev };
        for (let listId in newTasks) {
          newTasks[listId] = newTasks[listId].filter(
            (t) => t._id !== taskId
          );
        }
        return newTasks;
      });
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((prev) => {
        const newTasks = { ...prev };
        for (let listId in newTasks) {
          newTasks[listId] = newTasks[listId].map((t) =>
            t._id === updatedTask._id ? updatedTask : t
          );
        }
        return newTasks;
      });
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskDeleted", handleTaskDeleted);
    socket.on("taskUpdated", handleTaskUpdated);

    return () => {
      socket.emit("leaveBoard", boardId);
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskDeleted", handleTaskDeleted);
      socket.off("taskUpdated", handleTaskUpdated);
    };
  }, [boardId]);
}
