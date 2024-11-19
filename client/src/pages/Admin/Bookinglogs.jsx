import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

const BookingLogs = () => {
  const [bookingLogs, setBookingLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingLogs = async () => {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/booking-logs",
          {
            headers,
          }
        );
        setBookingLogs(response.data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            headers,
          }
        );
        setUsers(response.data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchBookingLogs(), fetchUsers()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  const existingUserIds = new Set(users.map((user) => user.user_id));

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h2 className="mb-4">Booking Logs</h2>
          <div style={{ maxHeight: "700px", overflowY: "auto" }}>
            <table className="table table-striped" style={{ position: "relative" }}>
              <thead
                className="table-dark"
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f8f9fa",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th>Log ID</th>
                  <th>Booking ID</th>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Port Name</th>
                  <th>Ship Name</th>
                  <th>Booking Start Date</th>
                  <th>Booking End Date</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {bookingLogs.length > 0 ? (
                  bookingLogs.map((log) => (
                    <tr
                      key={log.log_id}
                      className={
                        existingUserIds.has(log.user_id) ? "" : "table-danger"
                      }
                    >
                      <td>{log.log_id}</td>
                      <td>{log.booking_id}</td>
                      <td>{log.user_id}</td>
                      <td>{log.username}</td>
                      <td>{log.portname}</td>
                      <td>{log.shipname}</td>
                      <td>{new Date(log.booking_date_start).toLocaleString()}</td>
                      <td>{new Date(log.booking_date_end).toLocaleString()}</td>
                      <td>{log.booking_status}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No booking logs available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingLogs;
