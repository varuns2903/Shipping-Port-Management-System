import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [ports, setPorts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    position: "",
    salary: "",
    hire_date: "",
    port_id: "",
    port_name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchPorts();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.get("http://localhost:5000/api/employees", {
        headers,
      });
      setEmployees(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Error fetching employees:", error.response || error);
    }
  };

  const fetchPorts = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.get("http://localhost:5000/api/ports", {
        headers,
      });
      setPorts(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch ports");
      console.error("Error fetching ports:", error.response || error);
    }
  };

  const handleAddEmployee = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    const employeeToAdd = {
      ...newEmployee,
      port_name:
        ports.find((port) => port.port_id === newEmployee.port_id)?.port_name ||
        "",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employees",
        employeeToAdd,
        { headers }
      );
      setEmployees([...employees, response.data.data]);
      toast.success("Employee added successfully");
      setShowAddModal(false);
      fetchEmployees();
      setNewEmployee({
        first_name: "",
        last_name: "",
        position: "",
        salary: "",
        hire_date: "",
        port_id: "",
        port_name: "",
      });
    } catch (error) {
      toast.error("Failed to add employee");
      console.error("Error adding employee:", error.response || error);
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };

      try {
        await axios.delete(
          `http://localhost:5000/api/employees/${employeeId}`,
          { headers }
        );
        setEmployees(
          employees.filter((employee) => employee.employee_id !== employeeId)
        );
        toast.success("Employee deleted successfully");
      } catch (error) {
        toast.error("Failed to delete employee");
        console.error("Error deleting employee:", error.response || error);
      }
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      await axios.put(
        `http://localhost:5000/api/employees/${selectedEmployee.employee_id}`,
        selectedEmployee,
        { headers }
      );

      toast.success("Employee updated successfully");
      fetchEmployees();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update employee");
      console.error("Error updating employee:", error.response || error);
    }
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee({ ...selectedEmployee, [name]: value });
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      employee.employee_id.toString().toLowerCase().includes(searchLower) ||
      employee.first_name.toLowerCase().includes(searchLower) ||
      employee.last_name.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower) ||
      employee.port_name.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Employees</h2>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by ID, Name, Position, or Port Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button
        className="btn btn-dark mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Employee
      </button>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Employee ID</th>
              <th className="text-center">First Name</th>
              <th className="text-center">Last Name</th>
              <th className="text-center">Position</th>
              <th className="text-center">Salary</th>
              <th className="text-center">Hire Date</th>
              <th className="text-center">Port Name</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td className="text-center">{employee.employee_id}</td>
                  <td className="text-center">{employee.first_name}</td>
                  <td className="text-center">{employee.last_name}</td>
                  <td className="text-center">{employee.position}</td>
                  <td className="text-center">₹{employee.salary}</td>
                  <td className="text-center">{employee.hire_date}</td>
                  <td className="text-center">{employee.port_name}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-dark btn-sm me-2"
                      onClick={() => handleEditClick(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(employee.employee_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="page-link bg-transparent text-dark border-0"
              >
                Prev
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className="page-link bg-transparent border-0"
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="page-link bg-transparent text-dark border-0"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEmployee && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Employee</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    className="form-control"
                    value={selectedEmployee.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    className="form-control"
                    value={selectedEmployee.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="position" className="form-label">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    className="form-control"
                    value={selectedEmployee.position}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">
                    Salary
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    className="form-control"
                    value={selectedEmployee.salary}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="hireDate" className="form-label">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hire_date"
                    className="form-control"
                    value={selectedEmployee.hire_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="portId" className="form-label">
                    Port Name
                  </label>
                  <select
                    id="portId"
                    name="port_id"
                    className="form-select"
                    value={selectedEmployee.port_id}
                    onChange={handleChange}
                  >
                    {ports.map((port) => (
                      <option key={port.port_id} value={port.port_id}>
                        {port.port_name}
                      </option>
                    ))}
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
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Employee</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    className="form-control"
                    value={newEmployee.first_name}
                    onChange={handleNewEmployeeChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    className="form-control"
                    value={newEmployee.last_name}
                    onChange={handleNewEmployeeChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="position" className="form-label">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    className="form-control"
                    value={newEmployee.position}
                    onChange={handleNewEmployeeChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">
                    Salary
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    className="form-control"
                    value={newEmployee.salary}
                    onChange={handleNewEmployeeChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="hireDate" className="form-label">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hire_date"
                    className="form-control"
                    value={newEmployee.hire_date}
                    onChange={handleNewEmployeeChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="portId" className="form-label">
                    Port Name
                  </label>
                  <select
                    id="portId"
                    name="port_id"
                    className="form-select"
                    value={newEmployee.port_id}
                    onChange={handleNewEmployeeChange}
                  >
                    <option value="">Select Port</option>
                    {ports.map((port) => (
                      <option key={port.port_id} value={port.port_id}>
                        {port.port_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddEmployee}
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEmployees;
