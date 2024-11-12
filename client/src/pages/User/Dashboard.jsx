import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function UserDashboard() {
  const [userId, setUserId] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingShipments, setUpcomingShipments] = useState([]);
  const [containerStatuses, setContainerStatuses] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: token },
          }
        );
        setUserId(response.data.data.user_id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      // Fetch recent bookings
      axios
        .get(`/api/bookings/recent/${userId}`)
        .then((response) => setRecentBookings(response.data))
        .catch((error) =>
          console.error("Error fetching recent bookings:", error)
        );

      // Fetch upcoming shipments
      axios
        .get(`/api/shipments/upcoming/${userId}`)
        .then((response) => setUpcomingShipments(response.data))
        .catch((error) =>
          console.error("Error fetching upcoming shipments:", error)
        );

      // Fetch container statuses
      axios
        .get(`/api/shipments/container-status/${userId}`)
        .then((response) => setContainerStatuses(response.data))
        .catch((error) =>
          console.error("Error fetching container statuses:", error)
        );
    }
  }, [userId]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 font-weight-bold">User Dashboard</h1>

      {/* Recent Bookings Table */}
      <div className="mb-5">
        <h3 className="mb-3">Recent Bookings</h3>
        <div
          className="table-responsive"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          <table
            className="table table-bordered table-striped table-hover"
            style={{ position: "relative" }}
          >
            <thead
              className="table-dark"
              style={{ position: "sticky", top: 0 }}
            >
              <tr>
                <th>Booking ID</th>
                <th>Status</th>
                <th>Booking Date</th>
                <th>Required Space</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? (
                recentBookings.slice(0, 5).map((booking) => (
                  <tr key={booking.booking_id}>
                    <td>{booking.booking_id}</td>
                    <td>{booking.booking_status}</td>
                    <td>
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </td>
                    <td>{booking.required_space}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No recent bookings available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Shipments Table */}
      <div className="mb-5">
        <h3 className="mb-3">Upcoming Shipments</h3>
        <div
          className="table-responsive"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          <table
            className="table table-bordered table-striped table-hover"
            style={{ position: "relative" }}
          >
            <thead
              className="table-dark "
              style={{ position: "sticky", top: 0 }}
            >
              <tr>
                <th>Ship ID</th>
                <th>Ship Name</th>
                <th> Date</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {upcomingShipments.length > 0 ? (
                upcomingShipments.slice(0, 5).map((shipment) => (
                  <tr key={shipment.ship_id}>
                    <td>{shipment.ship_id}</td>
                    <td>{shipment.ship_name}</td>
                    <td>
                      {new Date(shipment.booking_date).toLocaleDateString()}
                    </td>
                    <td>{shipment.owner}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No upcoming shipments available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Container Statuses Table */}
      <div className="mb-5">
        <h3 className="mb-3">Container Info</h3>
        <div
          className="table-responsive"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          <table
            className="table table-bordered table-striped table-hover"
            style={{ position: "relative" }}
          >
            <thead
              className="table-dark"
              style={{ position: "sticky", top: 0 }}
            >
              <tr>
                <th>Container ID</th>
                <th>Container Type</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {containerStatuses.length > 0 ? (
                containerStatuses.slice(0, 5).map((container) => (
                  <tr key={container.container_id}>
                    <td>{container.container_id}</td>
                    <td>{container.container_type}</td>
                    <td>{container.weight}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No container info available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
