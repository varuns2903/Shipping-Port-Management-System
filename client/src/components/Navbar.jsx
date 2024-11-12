import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch the role from localStorage or from any context/state that has login info
    const userRole = localStorage.getItem("role"); // Assuming role is stored as "role"
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        {role === "admin" && (
          <button
            className="navbar-toggler ms-2 me-3"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        <span
          className="navbar-brand mb-0 h1 ps-3"
          style={{ fontSize: "1.75rem" }}
          onClick={() => navigate("/")}
        >
          Ship Port Management
        </span>

        {role === "user" && (
          <div className="ms-auto d-flex">
            <button
              className="btn btn-outline-light mx-2"
              onClick={() => navigate("/user/dashboard")}
            >
              Home
            </button>
            <button
              className="btn btn-outline-light mx-2"
              onClick={() => navigate("/user/book-port")}
            >
              Book Port
            </button>
            <button
              className="btn btn-outline-light mx-2"
              onClick={() => navigate("/user/browse-ports")}
            >
              Browse Ports
            </button>
            <button
              className="btn btn-outline-light mx-2"
              onClick={() => navigate("/user/Manage-Bookings")}
            >
              Manage Bookings
            </button>
          </div>
        )}

        {/* Profile Icon and Dropdown */}
        <div
          className={`dropdown ms-auto me-3 ${isDropdownOpen ? "show" : ""}`}
        >
          <button
            className="btn text-light bg-dark dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded={isDropdownOpen}
            onClick={toggleDropdown}
            style={{
              cursor: "pointer",
              fontSize: "1.5rem",
            }}
          >
            <i className="fa fa-user"></i>
          </button>
          <ul
            className={`dropdown-menu dropdown-menu-end ${
              isDropdownOpen ? "show" : ""
            }`}
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <button
                className="dropdown-item"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sidebar for Admin */}
      {role === "admin" && (
        <>
          <div
            className={`sidebar bg-dark text-light position-fixed top-0 ${
              isSidebarOpen ? "open" : ""
            }`}
            style={{
              width: "250px",
              height: "100vh",
              transition: "transform 0.3s ease",
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
              zIndex: 1000,
            }}
          >
            <h4 className="px-3 py-4 border-bottom text-center">Admin Panel</h4>
            <ul className="nav flex-column mt-2">
              <li className="nav-item">
                <button
                  className="nav-link text-light"
                  onClick={() => navigate("/admin/manage-users")}
                >
                  Manage Users
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-light"
                  onClick={() => navigate("/admin/manage-ports")}
                >
                  Manage Ports
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-light"
                  onClick={() => navigate("/admin/manage-bookings")}
                >
                  Manage Bookings
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-light"
                  onClick={() => navigate("/admin/manage-countries")}
                >
                  Manage Countries
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-light"
                  onClick={() => navigate("/admin/manage-employees")}
                >
                  Manage Employees
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-light"
                  onClick={() => navigate("/admin/manage-ships")}
                >
                  Manage Ships
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-light"
                  onClick={() => navigate("/admin/manage-containers")}
                >
                  Manage Containers
                </button>
              </li>
            </ul>
          </div>

          {/* Overlay to close the sidebar */}
          {isSidebarOpen && (
            <div
              className="overlay"
              onClick={toggleSidebar}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
            ></div>
          )}
        </>
      )}
      <style>
        {`
          .dropdown-toggle::after {
            display: none !important;
          }
          .dropdown-menu {
            right: 0%;
            left: auto;
            transform: translateX(-10px);
          }
        `}
      </style>
    </>
  );
}

export default Navbar;
