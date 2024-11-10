import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ManageContainers() {
  const [containers, setContainers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [containersPerPage] = useState(10);

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      const response = await axios.get("http://localhost:5000/api/containers", {
        headers,
      });
      setContainers(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch containers");
      console.error("Error fetching containers:", error.response || error);
    }
  };

  const handleEditClick = (container) => {
    setSelectedContainer(container);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (containerId) => {
    if (window.confirm("Are you sure you want to delete this container?")) {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };

      try {
        await axios.delete(
          `http://localhost:5000/api/containers/${containerId}`,
          { headers }
        );
        setContainers(
          containers.filter(
            (container) => container.container_id !== containerId
          )
        );
        toast.success("Container deleted successfully");
      } catch (error) {
        toast.error("Failed to delete container");
        console.error("Error deleting container:", error.response || error);
      }
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      await axios.put(
        `http://localhost:5000/api/containers/${selectedContainer.container_id}`,
        {
          container_type: selectedContainer.container_type,
          weight: selectedContainer.weight,
          contents: selectedContainer.contents,
          ship_id: selectedContainer.ship_id,
          booking_id: selectedContainer.booking_id,
        },
        { headers }
      );

      toast.success("Container updated successfully");
      fetchContainers();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update container");
      console.error("Error updating container:", error.response || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedContainer({ ...selectedContainer, [name]: value });
  };

  const indexOfLastContainer = currentPage * containersPerPage;
  const indexOfFirstContainer = indexOfLastContainer - containersPerPage;
  const currentContainers = containers.slice(
    indexOfFirstContainer,
    indexOfLastContainer
  );
  const totalPages = Math.ceil(containers.length / containersPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Containers</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Container ID</th>
              <th className="text-center">Container Type</th>
              <th className="text-center">Weight</th>
              <th className="text-center">Contents</th>
              <th className="text-center">Ship</th>
              <th className="text-center">Booking Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentContainers.length > 0 ? (
              currentContainers.map((container) => (
                <tr key={container.container_id}>
                  <td className="text-center">{container.container_id}</td>
                  <td className="text-center">{container.container_type}</td>
                  <td className="text-center">{container.weight}</td>
                  <td className="text-center">{container.contents}</td>
                  <td className="text-center">{container.ship_name}</td>
                  <td className="text-center">{container.booking_status}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-dark btn-sm me-2"
                      onClick={() => handleEditClick(container)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(container.container_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No containers found
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
      {showEditModal && selectedContainer && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Container</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="containerType" className="form-label">
                    Container Type
                  </label>
                  <input
                    type="text"
                    id="containerType"
                    name="container_type"
                    className="form-control"
                    value={selectedContainer.container_type}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">
                    Weight
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    className="form-control"
                    value={selectedContainer.weight}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contents" className="form-label">
                    Contents
                  </label>
                  <input
                    type="text"
                    id="contents"
                    name="contents"
                    className="form-control"
                    value={selectedContainer.contents}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ship" className="form-label">
                    Ship ID
                  </label>
                  <input
                    type="number"
                    id="ship"
                    name="ship_id"
                    className="form-control"
                    value={selectedContainer.ship_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="booking" className="form-label">
                    Booking ID
                  </label>
                  <input
                    type="number"
                    id="booking"
                    name="booking_id"
                    className="form-control"
                    value={selectedContainer.booking_id}
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

export default ManageContainers;
