import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import BoardDetails from "./pages/BoardDetails";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/boards"
          element={
            <PrivateRoute>
              <Boards />
            </PrivateRoute>
          }
        />

        <Route
          path="/boards/:id"
          element={
            <PrivateRoute>
              <BoardDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
