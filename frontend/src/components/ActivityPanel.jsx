import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function ActivityPanel({ boardId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`/activity/${boardId}`);
        setActivities(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [boardId]);

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>📌 Activity</h3>

      {loading ? (
        <p>Loading...</p>
      ) : activities.length === 0 ? (
        <p style={styles.empty}>No activity yet</p>
      ) : (
        <div style={styles.list}>
          {activities.map((activity) => (
            <div key={activity._id} style={styles.item}>
              <strong>{activity.user?.name}</strong>
              <p style={styles.message}>{activity.message}</p>
              <span style={styles.time}>
                {new Date(activity.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  panel: {
    width: "280px",
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  heading: {
    marginTop: 0,
  },
  list: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  item: {
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  message: {
    margin: "5px 0",
  },
  time: {
    fontSize: "11px",
    color: "#888",
  },
  empty: {
    fontSize: "13px",
    color: "#888",
  },
};
