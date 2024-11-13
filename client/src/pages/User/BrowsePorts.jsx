import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";

const BrowsePorts = () => {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPorts = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ports/browse",
          { headers: { Authorization: token } }
        );
        setPorts(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to load ports.");
        setLoading(false);
      }
    };
    fetchPorts();
  }, []);

  const filteredPorts = ports.filter(
    (port) =>
      port.port_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (port.country_name &&
        port.country_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Browse Available Ports</h2>

        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by port or country name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading Spinner */}
        {loading && <p>Loading ports...</p>}
        {error && <p className="alert alert-danger">{error}</p>}

        {/* Ports Table */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">Port Name</th>
                <th scope="col">Country</th>
                <th scope="col">Capacity</th>
                <th scope="col">Available Space</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPorts.map((port) => (
                <tr key={port.port_id}>
                  <td>{port.port_name}</td>
                  <td>{port.country_name || "Unknown"}</td>
                  <td>{port.capacity}</td>
                  <td>{port.available_space}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        navigate(`/user/book-port?portId=${port.port_id}`)
                      }
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPorts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No ports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BrowsePorts;
