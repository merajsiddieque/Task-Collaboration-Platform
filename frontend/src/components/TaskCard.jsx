import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "../api/axios";

export default function TaskCard({ task, members, onDelete, onTaskUpdate }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "#f4f6f8",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  // ✅ Multi-assign handler
  const handleAssign = async (userIds) => {
    try {
      const res = await axios.put(`/tasks/${task._id}`, {
        assignedTo: userIds, // send array
      });

      // Immediately update parent state
      if (onTaskUpdate) {
        onTaskUpdate(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag Area */}
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab", fontWeight: "500" }}
      >
        {task.title}
      </div>

      {/* 🔥 Multi Assignment Dropdown */}
      {/* Assignment Dropdown */}
      <select
        onChange={(e) => {
          const selectedId = e.target.value;
          if (!selectedId) return;

          let updatedUsers = [];

          const alreadyAssigned = task.assignedTo?.some(
            (u) => u._id === selectedId,
          );

          if (alreadyAssigned) {
            // Remove user
            updatedUsers = task.assignedTo.filter((u) => u._id !== selectedId);
          } else {
            // Add user
            const userToAdd = members.find((m) => m._id === selectedId);
            updatedUsers = [...(task.assignedTo || []), userToAdd];
          }

          handleAssign(updatedUsers.map((u) => u._id));
        }}
        value=""
        style={{
          padding: "4px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Assign member...</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>

      {/* 👥 Assigned Users Display */}
      {task.assignedTo?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {task.assignedTo.map((user) => (
            <span
              key={user._id}
              style={{
                background: "#e6f4ff",
                color: "#1677ff",
                padding: "2px 6px",
                borderRadius: "12px",
                fontSize: "11px",
              }}
            >
              👤 {user.name}
            </span>
          ))}
        </div>
      )}

      {task.assignedTo?.length > 0 && (
        <div style={{ fontSize: "12px", color: "#555" }}>👥 Assigned</div>
      )}

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task._id)}
        style={{
          background: "transparent",
          border: "none",
          color: "#ff4d4f",
          fontSize: "14px",
          cursor: "pointer",
          alignSelf: "flex-end",
        }}
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
    </div>
  );
}
