// src/pages/ManageBooking.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserIdAndBookings = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Step 1: Fetch the user ID from the token
        const userResponse = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: token },
          }
        );
        const userId = userResponse.data.data.user_id;

        // Step 2: Fetch bookings for this user ID
        const bookingsResponse = await axios.get(
          `http://localhost:5000/api/bookings/user/${userId}`,
          {
            headers: { Authorization: token },
          }
        );
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching user or bookings:", error);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserIdAndBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: token },
      });

      // Remove the deleted booking from the local state
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
    <div className="container mt-5">
      <h2 className="mb-4">Manage Your Bookings</h2>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Booking ID</th>
              <th>Port Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>Required Space</th> {/* New Column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.port_name}</td>
                <td>{booking.booking_status}</td>
                <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                <td>{booking.required_space} m³</td>{" "}
                {/* Display required_space */}
                <td>
                  {booking.booking_status === "pending" ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(booking.booking_id)}
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger btn-sm"
                      disabled
                    >
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
  );
};

export default ManageBooking;
