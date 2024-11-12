import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

function ManageShips() {
  const [ships, setShips] = useState([]);
  const [filteredShips, setFilteredShips] = useState([]);
  const [countries, setCountries] = useState([]);
  const [ports, setPorts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);
  const [newShip, setNewShip] = useState({
    ship_name: "",
    capacity: "",
    registration_number: "",
    owner: "",
    country_id: "",
    country_name: "",
    port_id: "",
    port_name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [shipsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchShips();
    fetchCountries();
    fetchPorts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredShips(ships);
    } else {
      const filtered = ships.filter((ship) =>
        [
          ship.ship_id,
          ship.ship_name,
          ship.registration_number,
          ship.country_name,
          ship.port_name,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredShips(filtered);
    }
  }, [searchQuery, ships]);

  const fetchShips = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.get("http://localhost:5000/api/admin/ships", {
        headers,
      });
      setShips(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch ships");
      console.error("Error fetching ships:", error.response || error);
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

  const handleEditClick = (ship) => {
    setSelectedShip(ship);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (shipId) => {
    if (window.confirm("Are you sure you want to delete this ship?")) {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };

      try {
        await axios.delete(`http://localhost:5000/api/admin/ships/${shipId}`, {
          headers,
        });
        setShips(ships.filter((ship) => ship.ship_id !== shipId));
        toast.success("Ship deleted successfully");
      } catch (error) {
        toast.error("Failed to delete ship");
        console.error("Error deleting ship:", error.response || error);
      }
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      await axios.put(
        `http://localhost:5000/api/admin/ships/${selectedShip.ship_id}`,
        {
          ship_name: selectedShip.ship_name,
          capacity: selectedShip.capacity,
          registration_number: selectedShip.registration_number,
          owner: selectedShip.owner,
          country_id: selectedShip.country_id,
          port_id: selectedShip.port_id,
        },
        { headers }
      );

      toast.success("Ship updated successfully");
      fetchShips();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update ship");
      console.error("Error updating ship:", error.response || error);
    }
  };

  const handleAddShipChange = (e) => {
    const { name, value } = e.target;
    setNewShip({ ...newShip, [name]: value });
  };

  const handleAddShipSubmit = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      await axios.post("http://localhost:5000/api/admin/ships", newShip, { headers });

      toast.success("New ship added successfully");
      fetchShips();
      setShowAddModal(false);
    } catch (error) {
      toast.error("Failed to add new ship");
      console.error("Error adding ship:", error.response || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedShip({ ...selectedShip, [name]: value });
  };

  const indexOfLastShip = currentPage * shipsPerPage;
  const indexOfFirstShip = indexOfLastShip - shipsPerPage;
  const currentShips = filteredShips.slice(indexOfFirstShip, indexOfLastShip);
  const totalPages = Math.ceil(filteredShips.length / shipsPerPage);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Manage Ships</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by Ship ID, Name, Registration Number, Country, or Port"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button
          className="btn btn-dark mb-3"
          onClick={() => setShowAddModal(true)}
        >
          Add New Ship
        </button>

        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Ship ID</th>
                <th className="text-center">Ship Name</th>
                <th className="text-center">Capacity</th>
                <th className="text-center">Registration Number</th>
                <th className="text-center">Owner</th>
                <th className="text-center">Country</th>
                <th className="text-center">Port</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentShips.length > 0 ? (
                currentShips.map((ship) => (
                  <tr key={ship.ship_id}>
                    <td className="text-center">{ship.ship_id}</td>
                    <td className="text-center">{ship.ship_name}</td>
                    <td className="text-center">{ship.capacity}</td>
                    <td className="text-center">{ship.registration_number}</td>
                    <td className="text-center">{ship.owner}</td>
                    <td className="text-center">{ship.country_name}</td>
                    <td className="text-center">
                      {ship.port_id} - {ship.port_name}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-dark btn-sm me-2"
                        onClick={() => handleEditClick(ship)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(ship.ship_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No ships found
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

        {/* Edit Modal */}
        {showEditModal && selectedShip && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Ship</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="shipName" className="form-label">
                      Ship Name
                    </label>
                    <input
                      type="text"
                      id="shipName"
                      name="ship_name"
                      className="form-control"
                      value={selectedShip.ship_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="capacity" className="form-label">
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      className="form-control"
                      value={selectedShip.capacity}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="registrationNumber" className="form-label">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      name="registration_number"
                      className="form-control"
                      value={selectedShip.registration_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="owner" className="form-label">
                      Owner
                    </label>
                    <input
                      type="text"
                      id="owner"
                      name="owner"
                      className="form-control"
                      value={selectedShip.owner}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="countryId" className="form-label">
                      Country
                    </label>
                    <select
                      id="countryId"
                      name="country_id"
                      className="form-control"
                      value={selectedShip.country_id}
                      onChange={handleChange}
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
                  <div className="mb-3">
                    <label htmlFor="portId" className="form-label">
                      Port
                    </label>
                    <select
                      id="portId"
                      name="port_id"
                      className="form-control"
                      value={selectedShip.port_id}
                      onChange={handleChange}
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

        {/* Add Ship Modal */}
        {showAddModal && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Ship</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="shipName" className="form-label">
                      Ship Name
                    </label>
                    <input
                      type="text"
                      id="shipName"
                      name="ship_name"
                      className="form-control"
                      value={newShip.ship_name}
                      onChange={handleAddShipChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="capacity" className="form-label">
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      className="form-control"
                      value={newShip.capacity}
                      onChange={handleAddShipChange}
                      min={0}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="registrationNumber" className="form-label">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      name="registration_number"
                      className="form-control"
                      value={newShip.registration_number}
                      onChange={handleAddShipChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="owner" className="form-label">
                      Owner
                    </label>
                    <input
                      type="text"
                      id="owner"
                      name="owner"
                      className="form-control"
                      value={newShip.owner}
                      onChange={handleAddShipChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="countryId" className="form-label">
                      Country
                    </label>
                    <select
                      id="countryId"
                      name="country_id"
                      className="form-control"
                      value={newShip.country_id}
                      onChange={handleAddShipChange}
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
                  <div className="mb-3">
                    <label htmlFor="portId" className="form-label">
                      Port
                    </label>
                    <select
                      id="portId"
                      name="port_id"
                      className="form-control"
                      value={newShip.port_id}
                      onChange={handleAddShipChange}
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
                    onClick={handleAddShipSubmit}
                  >
                    Add Ship
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

export default ManageShips;
