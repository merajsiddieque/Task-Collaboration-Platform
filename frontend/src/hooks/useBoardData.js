// hooks/useBoardData.js
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function useBoardData(boardId) {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoard = async () => {
    const res = await axios.get(`/boards/${boardId}`);
    setMembers(res.data.members);
  };

  const fetchLists = async () => {
    const res = await axios.get(`/lists/${boardId}`);
    setLists(res.data);

    const taskData = {};
    for (let list of res.data) {
      const taskRes = await axios.get(`/tasks/${list._id}`);
      taskData[list._id] = taskRes.data;
    }
    setTasks(taskData);
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
    lists,
    tasks,
    members,
    setTasks,
    setLists,
    loading,
    fetchLists,
  };
}
