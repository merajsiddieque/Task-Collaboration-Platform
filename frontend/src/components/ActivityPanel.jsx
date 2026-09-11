import ActivitySidebar from "./ActivitySidebar";

export default function ActivityPanel({ boardId, members = [] }) {
  return <ActivitySidebar boardId={boardId} members={members} />;
}
