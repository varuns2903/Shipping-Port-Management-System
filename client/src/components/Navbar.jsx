import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <button
        className="navbar-toggler ms-2 me-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <span
        className="navbar-brand mb-0 h1 ps-3"
        style={{ fontSize: "1.75rem" }}
      >
        Ship Port Management
      </span>

      <button
        className="text-light ms-auto me-3 border-0 bg-dark"
        style={{ cursor: "pointer", fontSize: "1.25rem" }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
