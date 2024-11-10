import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ManageShips() {
  const [ships, setShips] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [shipsPerPage] = useState(10);

  useEffect(() => {
    fetchShips();
  }, []);

  const fetchShips = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.get("http://localhost:5000/api/ships", {
        headers,
      });
      setShips(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch ships");
      console.error("Error fetching ships:", error.response || error);
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
        await axios.delete(`http://localhost:5000/api/ships/${shipId}`, {
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
        `http://localhost:5000/api/ships/${selectedShip.ship_id}`,
        { headers },
        {
          ship_name: selectedShip.ship_name,
          capacity: selectedShip.capacity,
          registration_number: selectedShip.registration_number,
          owner: selectedShip.owner,
          country_id: selectedShip.country_id,
          port_id: selectedShip.port_id,
        }
      );

      toast.success("Ship updated successfully");
      fetchShips();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update ship");
      console.error("Error updating ship:", error.response || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedShip({ ...selectedShip, [name]: value });
  };

  const indexOfLastShip = currentPage * shipsPerPage;
  const indexOfFirstShip = indexOfLastShip - shipsPerPage;
  const currentShips = ships.slice(indexOfFirstShip, indexOfLastShip);
  const totalPages = Math.ceil(ships.length / shipsPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Ships</h2>

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
                  <td className="text-center">{ship.port_id}</td>
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
                    Country ID
                  </label>
                  <input
                    type="number"
                    id="countryId"
                    name="country_id"
                    className="form-control"
                    value={selectedShip.country_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="portId" className="form-label">
                    Port ID
                  </label>
                  <input
                    type="number"
                    id="portId"
                    name="port_id"
                    className="form-control"
                    value={selectedShip.port_id}
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
  );
}

export default ManageShips;
