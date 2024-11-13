// src/pages/ManageBooking.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserIdAndBookings = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const userResponse = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: token },
          }
        );
        const userId = userResponse.data.data.user_id;

        const bookingsResponse = await axios.get(
          `http://localhost:5000/api/bookings/user/${userId}`,
          {
            headers: { Authorization: token },
          }
        );
        setBookings(bookingsResponse.data);
        setFilteredBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching user or bookings:", error);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserIdAndBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter((booking) => {
      const matchesSearchTerm =
        booking.booking_id.toString().includes(searchTerm) ||
        booking.port_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || booking.booking_status === filterStatus;

      return matchesSearchTerm && matchesStatus;
    });
    setFilteredBookings(filtered);
  }, [searchTerm, filterStatus, bookings]);

  const handleDelete = async (bookingId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: token },
      });

      setBookings(
        bookings.filter((booking) => booking.booking_id !== bookingId)
      );
      toast.success("Booking canceled successfully.");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking.");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Manage Your Bookings</h2>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Booking ID or Port Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="mb-4">
          <label className="me-3">Filter by Status:</label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              id="statusAll"
              value="all"
              checked={filterStatus === "all"}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <label className="form-check-label" htmlFor="statusAll">
              All
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              id="statusPending"
              value="pending"
              checked={filterStatus === "pending"}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <label className="form-check-label" htmlFor="statusPending">
              Pending
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              id="statusConfirmed"
              value="confirmed"
              checked={filterStatus === "confirmed"}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <label className="form-check-label" htmlFor="statusConfirmed">
              Confirmed
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="status"
              id="statusCancelled"
              value="canceled"
              checked={filterStatus === "canceled"}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <label className="form-check-label" htmlFor="statusCancelled">
              Cancelled
            </label>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>Port Name</th>
                <th>Status</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Required Space</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.port_name}</td>
                  <td>{booking.booking_status}</td>
                  <td>
                    {new Date(booking.booking_date_start).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(booking.booking_date_end).toLocaleDateString()}
                  </td>
                  <td>{booking.required_space} m³</td>
                  <td>
                    {booking.booking_status === "pending" ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(booking.booking_id)}
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <button className="btn btn-danger btn-sm" disabled>
                        Cancel Booking
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManageBooking;
