import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

const BookPort = () => {
  const location = useLocation();
  const [ports, setPorts] = useState([]);
  const [ships, setShips] = useState([]);
  const [selectedPortCapacity, setSelectedPortCapacity] = useState(null);
  const [bookingData, setBookingData] = useState({
    user_id: "",
    port_id: "",
    ship_id: "",
    booking_datetime: "", // Changed to booking_datetime
    ship_name: "",
    required_space: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Extract portId from the query parameter if present
  const portId = new URLSearchParams(location.search).get("portId");

  // Fetch user ID and optionally autofill port details if portId exists
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchUserIdAndPort = async () => {
      try {
        if (token) {
          const userResponse = await axios.get(
            "http://localhost:5000/api/users/profile",
            { headers: { Authorization: token } }
          );
          const userId = userResponse.data.data.user_id;
          setBookingData((prevData) => ({
            ...prevData,
            user_id: userId,
            port_id: portId || "", // Set port_id if portId is provided
          }));

          // Fetch all ports data
          const portResponse = await axios.get(
            `http://localhost:5000/api/ports/browse`
          );
          setPorts(portResponse.data);

          // If portId exists, autofill port name and available capacity
          if (portId) {
            const selectedPort = portResponse.data.find(
              (port) => port.port_id === parseInt(portId)
            );

            if (selectedPort) {
              setSelectedPortCapacity(selectedPort.available_space);
            }
          }
        } else {
          setErrorMessage("User not authenticated.");
        }
      } catch (error) {
        console.log(error);
        
        setErrorMessage("Failed to fetch user ID or port details.");
      }
    };

    fetchUserIdAndPort();
  }, [portId]);

  // Fetch ships data
  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/bookings/ships"
        );
        setShips(response.data);
      } catch (error) {
        console.log(error);
        
        setErrorMessage("Failed to load ships.");
      }
    };

    fetchShips();
  }, []);

  // Handle input changes
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "port_id") {
      const selectedPort = ports.find(
        (port) => port.port_id === parseInt(value)
      );
      if (selectedPort) {
        setSelectedPortCapacity(selectedPort.available_space);
      } else {
        setSelectedPortCapacity(null);
      }
    }

    // Set ship_name based on selected ship_id
    if (name === "ship_id") {
      const selectedShip = ships.find(
        (ship) => ship.ship_id === parseInt(value)
      );
      if (selectedShip) {
        setBookingData((prevData) => ({
          ...prevData,
          ship_name: selectedShip.ship_name,
        }));
      }
    }
  };

  // Handle required space validation
  const checkAvailableSpace = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/checkAvailableSpace/${bookingData.port_id}`
      );
      const availableSpace = response.data.available_space;
      if (bookingData.required_space > availableSpace) {
        setErrorMessage("Required space exceeds available capacity.");
      } else {
        setErrorMessage("");
      }
    } catch (error) {
        console.log(error);
        
      setErrorMessage("Failed to check available space.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the required space does not exceed available space
    if (errorMessage) {
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/bookings/book",
        bookingData
      );
      setSuccessMessage("Booking successful!");
      setErrorMessage("");
      setBookingData({
        port_id: "",
        ship_id: "",
        booking_datetime: "", // Reset the datetime field
        ship_name: "",
        required_space: 0,
        user_id: "",
      });
      setSelectedPortCapacity(null);
    } catch (error) {
        console.log(error);
        
      setErrorMessage("Failed to book port. Please try again.");
      setSuccessMessage("");
    }
  };

  // Get current date and time for the min date and time validation
  const currentDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Book a Port</h2>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form
        onSubmit={handleSubmit}
        className="border border-dark p-4 bg-light shadow-sm rounded"
      >
        {/* Port Selection */}
        <div className="mb-3">
          <label className="form-label">Select Port</label>
          <select
            id="port"
            name="port_id"
            className="form-select"
            value={bookingData.port_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Choose a port...</option>
            {ports.map((port) => (
              <option key={port.port_id} value={port.port_id}>
                {port.port_name}
              </option>
            ))}
          </select>
          {selectedPortCapacity !== null && (
            <small className="form-text text-muted">
              Available Capacity: {selectedPortCapacity} cubic meters
            </small>
          )}
        </div>

        {/* Ship Selection */}
        <div className="mb-3">
          <label className="form-label">Select Ship</label>
          <select
            id="ship"
            name="ship_id"
            className="form-select"
            value={bookingData.ship_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Choose a ship...</option>
            {ships.length > 0 ? (
              ships.map((ship) => (
                <option key={ship.ship_id} value={ship.ship_id}>
                  {ship.ship_name}
                </option>
              ))
            ) : (
              <option disabled>No ships available</option>
            )}
          </select>
        </div>

        {/* Required Space */}
        <div className="mb-3">
          <label className="form-label">Required Space (in cubic meters)</label>
          <input
            type="number"
            id="required_space"
            name="required_space"
            className="form-control"
            value={bookingData.required_space}
            onChange={(e) => {
              handleInputChange(e);
              checkAvailableSpace();
            }}
            min="1"
            max={selectedPortCapacity || 0}
            required
          />
        </div>

        {/* Booking Date and Time */}
        <div className="mb-3">
          <label className="form-label">Booking Date and Time</label>
          <input
            type="datetime-local"
            id="booking_datetime"
            name="booking_datetime"
            className="form-control"
            value={bookingData.booking_datetime}
            onChange={handleInputChange}
            min={currentDateTime}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Book Port
        </button>
      </form>
    </div>
  );
};

export default BookPort;
