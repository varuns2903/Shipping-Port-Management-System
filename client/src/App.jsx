import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AdminDashboard from "./pages/Admin/Dashboard";
import BrowsePorts from "./pages/User/BrowsePorts";
import BookPort from "./pages/User/BookPort";
import TrackShipments from "./pages/User/TrackShipments";
import UserDashboard from "./pages/User/Dashboard";

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return token ? true : false;
  };

  const getRole = () => {
    return localStorage.getItem("role");
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        autoClose={1500}
      />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                getRole() === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <Navigate to="/user/dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin/dashboard"
            element={
              isAuthenticated() && getRole() === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/user/dashboard"
            element={
              isAuthenticated() && getRole() === "user" ? (
                <UserDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/user/browse-ports" element={<BrowsePorts />} />
          <Route path="/user/book-port" element={<BookPort />} />
          <Route path="/user/track-shipments" element={<TrackShipments />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
