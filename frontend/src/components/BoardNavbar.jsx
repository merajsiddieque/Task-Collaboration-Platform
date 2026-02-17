import { useNavigate } from "react-router-dom";

export default function BoardNavbar({
  searchQuery,
  setSearchQuery,
  isSearching,
}) {
  const navigate = useNavigate();

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>🧠 TaskFlow</h2>

      <div style={styles.rightSection}>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />

        {isSearching && (
          <span style={styles.searchingText}>Searching...</span>
        )}

        <button
          onClick={() => navigate("/boards")}
          style={styles.backBtn}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  navbar: {
    backgroundColor: "white",
    padding: "15px 25px",
    borderRadius: "12px",
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    margin: 0,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  searchInput: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    width: "220px",
  },
  searchingText: {
    fontSize: "12px",
    color: "#888",
  },
  backBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};
