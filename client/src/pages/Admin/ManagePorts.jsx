import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

function ManagePorts() {
  const [ports, setPorts] = useState([]);
  const [filteredPorts, setFilteredPorts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPort, setSelectedPort] = useState(null);
  const [newPort, setNewPort] = useState({
    port_name: "",
    capacity: "",
    available_space: "",
    location: "",
    country_id: "",
    country_name: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [portsPerPage] = useState(10);

  useEffect(() => {
    fetchPorts();
    fetchCountries();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, ports]);

  const fetchPorts = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.get("http://localhost:5000/api/admin/ports", {
        headers,
      });
      setPorts(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch ports");
      console.error("Error fetching ports:", error.response || error);
    }
  };

  const fetchCountries = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.get("http://localhost:5000/api/admin/countries", {
        headers,
      });
      setCountries(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch countries");
      console.error("Error fetching countries:", error.response || error);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = ports.filter(
      (port) =>
        port.port_name.toLowerCase().includes(query) ||
        port.country_name.toLowerCase().includes(query) ||
        port.port_id.toString().includes(query)
    );
    setFilteredPorts(filtered);
  };

  const handleEditClick = (port) => {
    setSelectedPort(port);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (portId) => {
    if (window.confirm("Are you sure you want to delete this port?")) {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };
      try {
        await axios.delete(`http://localhost:5000/api/admin/ports/${portId}`, {
          headers,
        });
        setPorts(ports.filter((port) => port.port_id !== portId));
        fetchPorts();
        toast.success("Port deleted successfully");
      } catch (error) {
        toast.error(error.response.data.error);
        console.error("Error deleting port:", error.response || error);
      }
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };
    try {
      await axios.put(
        `http://localhost:5000/api/admin/ports/${selectedPort.port_id}`,
        {
          port_name: selectedPort.port_name,
          country_id: selectedPort.country_id,
          country: selectedPort.country_name,
          capacity: selectedPort.capacity,
          available_space: selectedPort.available_space,
          location: selectedPort.location,
        },
        { headers }
      );

      toast.success("Port updated successfully");
      fetchPorts();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update port");
      console.error("Error updating port:", error.response || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPort({ ...selectedPort, [name]: value });
  };

  const handleAddPortChange = (e) => {
    const { name, value } = e.target;
    setNewPort({ ...newPort, [name]: value });
  };

  const handleAddNewPort = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      await axios.post("http://localhost:5000/api/admin/ports", newPort, { headers });
      toast.success("Port added successfully");
      setShowAddModal(false);
      fetchPorts();
      setNewPort({
        port_name: "",
        capacity: "",
        available_space: "",
        location: "",
        country_id: "",
        country_name: "",
      });
    } catch (error) {
      toast.error("Failed to add port");
      console.error("Error adding port:", error.response || error);
    }
  };

  const indexOfLastPort = currentPage * portsPerPage;
  const indexOfFirstPort = indexOfLastPort - portsPerPage;
  const currentPorts = filteredPorts.slice(indexOfFirstPort, indexOfLastPort);
  const totalPages = Math.ceil(filteredPorts.length / portsPerPage);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Manage Ports</h2>

        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Port ID or Port Name or Country Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="btn btn-dark mb-4"
          onClick={() => setShowAddModal(true)}
        >
          Add New Port
        </button>

        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Port ID</th>
                <th className="text-center">Port Name</th>
                <th className="text-center">Country Name</th>
                <th className="text-center">Capacity</th>
                <th className="text-center">Available Space</th>
                <th className="text-center">Location</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPorts.length > 0 ? (
                currentPorts.map((port) => (
                  <tr key={port.port_id}>
                    <td className="text-center">{port.port_id}</td>
                    <td className="text-center">{port.port_name}</td>
                    <td className="text-center">{port.country_name}</td>
                    <td className="text-center">{port.capacity}</td>
                    <td className="text-center">{port.available_space}</td>
                    <td className="text-center">{port.location}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-dark btn-sm me-2"
                        onClick={() => handleEditClick(port)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(port.port_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No ports found
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
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
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

        {/* Add New Port Modal */}
        {showAddModal && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Port</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="portName" className="form-label">
                      Port Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="portName"
                      name="port_name"
                      value={newPort.port_name}
                      onChange={handleAddPortChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="capacity" className="form-label">
                      Capacity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="capacity"
                      name="capacity"
                      value={newPort.capacity}
                      onChange={handleAddPortChange}
                      min={0}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="availableSpace" className="form-label">
                      Available Space
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="availableSpace"
                      name="available_space"
                      value={newPort.available_space}
                      onChange={handleAddPortChange}
                      min={0}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={newPort.location}
                      onChange={handleAddPortChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select
                      className="form-select"
                      id="country"
                      name="country_id"
                      value={newPort.country_id}
                      onChange={handleAddPortChange}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option
                          key={country.country_id}
                          value={country.country_id}
                        >
                          {country.country_name}
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
                    onClick={handleAddNewPort}
                  >
                    Save New Port
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedPort && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Port</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="portName" className="form-label">
                      Port Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="portName"
                      name="port_name"
                      value={selectedPort.port_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="capacity" className="form-label">
                      Capacity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="capacity"
                      name="capacity"
                      value={selectedPort.capacity}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="availableSpace" className="form-label">
                      Available Space
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="availableSpace"
                      name="available_space"
                      value={selectedPort.available_space}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={selectedPort.location}
                      onChange={handleChange}
                    />
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
      </div>
    </>
  );
}

export default ManagePorts;
