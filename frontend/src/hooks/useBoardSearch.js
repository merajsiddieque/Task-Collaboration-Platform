// hooks/useBoardSearch.js
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function useBoardSearch(boardId, setTasks, fetchLists) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchLists();
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setIsSearching(true);

        const res = await axios.get(
          `/tasks/search?boardId=${boardId}&query=${searchQuery}`
        );

        const grouped = {};
        res.data.forEach((task) => {
          if (!grouped[task.list]) grouped[task.list] = [];
          grouped[task.list].push(task);
        });

        setTasks(grouped);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery, boardId]);

  return { searchQuery, setSearchQuery, isSearching };
}
