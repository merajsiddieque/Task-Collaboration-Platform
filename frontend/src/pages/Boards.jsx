import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get("/boards");
      setBoards(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createBoard = async () => {
    if (!title.trim()) return;

    try {
      const res = await axios.post("/boards", { title });
      setBoards((prev) => [...prev, res.data]);
      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBoard = async (boardId) => {
    if (!window.confirm("Delete this board?")) return;

    try {
      await axios.delete(`/boards/${boardId}`);
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
    } catch (error) {
      console.log(error);
    }
  };

  const inviteBoard = async (boardId) => {
    const email = prompt("Enter email to Add Board Member:");
    if (!email) return;

    try {
      await axios.post(`/boards/${boardId}/invite`, { email });
      alert("Member Added successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Error inviting member");
    }
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={{ margin: 0 }}>🧠 TaskFlow</h2>

        <div style={styles.navRight}>
          <span style={styles.userName}>👋 {user?.name || "User"}</span>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={styles.container}>
        <h1 style={styles.header}>Your Boards</h1>

        {/* Create Board */}
        <div style={styles.createSection}>
          <input
            style={styles.input}
            placeholder="Enter new board title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button style={styles.button} onClick={createBoard}>
            Create
          </button>
        </div>

        {/* Boards Grid */}
        <div style={styles.grid}>
          {boards.map((board) => (
            <div
              key={board._id}
              style={styles.card}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0px)")
              }
              onClick={() => navigate(`/boards/${board._id}`)}
            >
              <div style={styles.cardHeader}>
                <h3 style={{ margin: 0 }}>{board.title}</h3>

                <div style={styles.iconColumn}>
                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBoard(board._id);
                    }}
                    style={styles.iconBtn}
                    title="Delete board"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>

                  {/* Invite */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      inviteBoard(board._id);
                    }}
                    style={styles.iconBtnadd}
                    title="Invite member"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-person-plus-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      <path
                        fill-rule="evenodd"
                        d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <p style={styles.membersText}>
                {board.members?.length || 1} Members
              </p>
            </div>
          ))}
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

  navbar: {
    backgroundColor: "white",
    padding: "15px 25px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  userName: {
    fontSize: "14px",
    color: "#555",
  },

  logoutBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ff4d4f",
    color: "white",
    fontSize: "13px",
  },

  container: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  header: {
    marginBottom: "25px",
    fontSize: "32px",
    fontWeight: "700",
  },

  createSection: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    flex: 1,
    fontSize: "14px",
  },

  button: {
    padding: "12px 20px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    padding: "22px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #36373b, #626cc9)",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#ff4d4f",
    fontSize: "16px",
    cursor: "pointer",
  },

  membersText: {
    color: "#12adef",
    fontSize: "14px",
    marginTop: "10px",
    fontWeight: "500",
  },

  iconColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  iconBtn: {
    background: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#ff4d4f",
  },

  iconBtnadd: {
    background: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#53ff4d",
  },
};
