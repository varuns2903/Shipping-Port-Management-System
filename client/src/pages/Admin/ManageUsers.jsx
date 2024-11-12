import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../../components/Navbar";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });
  const [newRole, setNewRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, roleFilter, users]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers,
      });
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error.response || error);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        (user.user_id.toString().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)) &&
        (roleFilter === "" || user.role === roleFilter)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowEditModal(true);
  };

  const handleRoleChange = (event) => {
    setNewRole(event.target.value);
  };

  const handleSaveRole = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser.user_id}`,
        { role: newRole },
        { headers }
      );

      toast.success("Role updated successfully");

      setUsers(
        users.map((user) =>
          user.user_id === selectedUser.user_id
            ? { ...user, role: newRole }
            : user
        )
      );

      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
      console.error("Error updating role:", error.response || error);
    }
  };

  const handleDeleteClick = async (user) => {
    if (window.confirm("Are you sure you want to delete this port?")) {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };

      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${user.user_id}`, {
          headers,
        });
        setUsers(users.filter((user) => user.user_id !== user.user_id));
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
        console.error("Error deleting user:", error.response || error);
      }
    }
  };

  const handleAddUserClick = () => {
    setNewUser({
      username: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    });
    setShowAddModal(true);
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUserSave = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/users",
        {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          password: newUser.password,
        },
        { headers }
      );

      toast.success("User added successfully");

      setUsers([
        ...users,
        {
          user_id: response.data.user_id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      ]);
      setShowAddModal(false);
    } catch (error) {
      toast.error(error.response.data.message);

      console.error("Error adding user:", error.response || error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Manage Users</h2>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, Username, or Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="roleAll"
              name="roleFilter"
              value=""
              checked={roleFilter === ""}
              onChange={() => setRoleFilter("")}
            />
            <label className="form-check-label" htmlFor="roleAll">
              All
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="roleUser"
              name="roleFilter"
              value="user"
              checked={roleFilter === "user"}
              onChange={() => setRoleFilter("user")}
            />
            <label className="form-check-label" htmlFor="roleUser">
              User
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="roleAdmin"
              name="roleFilter"
              value="admin"
              checked={roleFilter === "admin"}
              onChange={() => setRoleFilter("admin")}
            />
            <label className="form-check-label" htmlFor="roleAdmin">
              Admin
            </label>
          </div>
        </div>

        <button className="btn btn-dark mb-3" onClick={handleAddUserClick}>
          Add New User
        </button>

        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Username</th>
                <th className="text-center">Email</th>
                <th className="text-center">Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td className="text-center">{user.user_id}</td>
                    <td className="text-center">{user.username}</td>
                    <td className="text-center">{user.email}</td>
                    <td className="text-center">{user.role}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-dark btn-sm me-2"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                } mx-1`}
              >
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="page-link bg-transparent text-dark border-0"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  } mx-1`}
                >
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`page-link ${
                      currentPage === index + 1 ? "btn-dark" : "bg-transparent"
                    } border-0`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                } mx-1`}
              >
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="page-link bg-transparent text-dark border-0"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}

        {showEditModal && selectedUser && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editModalLabel">
                    Edit User Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="userId" className="form-label">
                      User ID
                    </label>
                    <input
                      id="userId"
                      className="form-control"
                      type="text"
                      value={selectedUser.user_id}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      id="username"
                      className="form-control"
                      type="text"
                      value={selectedUser.username}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      className="form-control"
                      type="email"
                      value={selectedUser.email}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Role
                    </label>
                    <select
                      id="role"
                      className="form-select"
                      value={newRole}
                      onChange={handleRoleChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveRole}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="addUsername" className="form-label">
                      Username
                    </label>
                    <input
                      id="addUsername"
                      name="username"
                      className="form-control"
                      type="text"
                      value={newUser.username}
                      onChange={handleAddUserChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="addEmail" className="form-label">
                      Email
                    </label>
                    <input
                      id="addEmail"
                      name="email"
                      className="form-control"
                      type="email"
                      value={newUser.email}
                      onChange={handleAddUserChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="addRole" className="form-label">
                      Role
                    </label>
                    <select
                      id="addRole"
                      name="role"
                      className="form-select"
                      value={newUser.role}
                      onChange={handleAddUserChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="addPassword" className="form-label">
                      Password
                    </label>
                    <input
                      id="addPassword"
                      name="password"
                      className="form-control"
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={handleAddUserChange}
                    />
                    <span
                      className="position-absolute"
                      style={{
                        top: "50%",
                        right: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="addConfirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      id="addConfirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      type={showConfirmPassword ? "text" : "password"}
                      value={newUser.confirmPassword}
                      onChange={handleAddUserChange}
                    />
                    <span
                      className="position-absolute"
                      style={{
                        top: "50%",
                        right: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddUserSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ManageUsers;
