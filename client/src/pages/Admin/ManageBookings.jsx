import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };
    try {
      const response = await axios.get("http://localhost:5000/api/bookings", {
        headers,
      });
      setBookings(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error("Error fetching bookings:", error.response || error);
    }
  };

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers,
        });
        setBookings(
          bookings.filter((booking) => booking.booking_id !== bookingId)
        );
        toast.success("Booking deleted successfully");
      } catch (error) {
        toast.error("Failed to delete booking");
        console.error("Error deleting booking:", error.response || error);
      }
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${selectedBooking.booking_id}`,
        {
          booking_status: selectedBooking.booking_status,
        },
        { headers }
      );

      toast.success("Booking updated successfully");
      fetchBookings();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update booking");
      console.error("Error updating booking:", error.response || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedBooking({ ...selectedBooking, [name]: value });
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Bookings</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Booking ID</th>
              <th className="text-center">User ID</th>
              <th className="text-center">Port ID</th>
              <th className="text-center">Ship ID</th>
              <th className="text-center">Booking Date</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length > 0 ? (
              currentBookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td className="text-center">{booking.booking_id}</td>
                  <td className="text-center">{booking.user_id}</td>
                  <td className="text-center">{booking.port_id}</td>
                  <td className="text-center">{booking.ship_id}</td>
                  <td className="text-center">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </td>
                  <td className="text-center">{booking.booking_status}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-dark btn-sm me-2"
                      onClick={() => handleEditClick(booking)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(booking.booking_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No bookings found
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
      {showEditModal && selectedBooking && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Booking</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="bookingStatus" className="form-label">
                    Booking Status
                  </label>
                  <select
                    id="bookingStatus"
                    name="booking_status"
                    className="form-select"
                    value={selectedBooking.booking_status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="canceled">Canceled</option>
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
    </div>
  );
}

export default ManageBookings;
