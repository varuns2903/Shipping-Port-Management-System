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
import ManageUsers from "./pages/Admin/ManageUsers";
import ProfilePage from "./pages/ProfilePage";
import ManagePorts from "./pages/Admin/ManagePorts";
import ManageBookings from "./pages/Admin/ManageBookings";
import ManageCountries from "./pages/Admin/ManageCountries";
import ManageEmployees from "./pages/Admin/ManageEmployees";
import ManageShips from "./pages/Admin/ManageShips";
import ManageContainers from "./pages/Admin/ManageContainers";

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    
    return token ? true : false;
  };

  const getRole = () => localStorage.getItem("role");

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
                ) : getRole() === "user" ? (
                  <Navigate to="/user/dashboard" />
                ) : (
                  <Navigate to="login" />
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
