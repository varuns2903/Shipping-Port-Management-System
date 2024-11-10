import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ManageCountries() {
  const [countries, setCountries] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage] = useState(10);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };
    try {
      const response = await axios.get("http://localhost:5000/api/countries", {
        headers,
      });
      setCountries(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch countries");
      console.error("Error fetching countries:", error.response || error);
    }
  };

  const handleEditClick = (country) => {
    setSelectedCountry(country);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (countryId) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };
      try {
        await axios.delete(`http://localhost:5000/api/countries/${countryId}`, {
          headers,
        });
        setCountries(
          countries.filter((country) => country.country_id !== countryId)
        );
        toast.success("Country deleted successfully");
      } catch (error) {
        toast.error("Failed to delete country");
        console.error("Error deleting country:", error.response || error);
      }
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };
    try {
      await axios.put(
        `http://localhost:5000/api/countries/${selectedCountry.country_id}`,
        {
          country_name: selectedCountry.country_name,
        },
        { headers }
      );

      toast.success("Country updated successfully");
      fetchCountries();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update country");
      console.error("Error updating country:", error.response || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCountry({ ...selectedCountry, [name]: value });
  };

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = countries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );
  const totalPages = Math.ceil(countries.length / countriesPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Countries</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Country ID</th>
              <th className="text-center">Country Name</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCountries.length > 0 ? (
              currentCountries.map((country) => (
                <tr key={country.country_id}>
                  <td className="text-center">{country.country_id}</td>
                  <td className="text-center">{country.country_name}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-dark btn-sm me-2"
                      onClick={() => handleEditClick(country)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(country.country_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No countries found
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
      {showEditModal && selectedCountry && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Country</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="countryName" className="form-label">
                    Country Name
                  </label>
                  <input
                    type="text"
                    id="countryName"
                    name="country_name"
                    className="form-control"
                    value={selectedCountry.country_name}
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

export default ManageCountries;
