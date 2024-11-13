// src/pages/BrowsePorts.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";

const BrowsePorts = () => {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) return <p>Loading ports...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Browse Available Ports</h2>
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
              {ports.map((port) => (
                <tr key={port.port_id}>
                  <td>{port.port_name}</td>
                  <td>{port.country_name || "Unknown"}</td>
                  {/* Display country_name */}
                  <td>{port.capacity}</td>
                  <td>{port.available_space}</td>
                  <td>
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() =>
                        navigate(`/user/book-port?portId=${port.port_id}`)
                      }
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BrowsePorts;
