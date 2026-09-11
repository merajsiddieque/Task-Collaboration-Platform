// hooks/useBoardData.js
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function useBoardData(boardId) {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoard = async () => {
    try {
      const res = await axios.get(`/boards/${boardId}`);
      setBoard(res.data);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  };

  const fetchLists = async () => {
    try {
      const res = await axios.get(`/lists/${boardId}`);
      setLists(res.data);

      const taskData = {};
      for (let list of res.data) {
        const taskRes = await axios.get(`/tasks/${list._id}`);
        taskData[list._id] = taskRes.data;
      }
      setTasks(taskData);
    } catch (err) {
      console.error("Error fetching lists:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchBoard();
      await fetchLists();
      setLoading(false);
    };

    init();
  }, [boardId]);

  return {
    board,
    lists,
    tasks,
    members,
    setTasks,
    setLists,
    loading,
    fetchLists,
    fetchBoard,
  };
}
